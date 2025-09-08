import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image, format, sessionId } = await request.json()
    
    if (!image || !format) {
      return NextResponse.json(
        { error: 'Image and format are required' },
        { status: 400 }
      )
    }

    // Get the stored SBOM data
    const analysisData = global.analysisResults?.[sessionId]
    
    if (!analysisData || !analysisData.sboms[format]) {
      return NextResponse.json(
        { error: 'SBOM not found. Please run analysis first.' },
        { status: 404 }
      )
    }

    const sbomContent = analysisData.sboms[format].content

    // Determine content type based on format
    let contentType = 'application/json'
    let fileExtension = 'json'
    
    switch (format) {
      case 'cyclonedx-xml':
        contentType = 'application/xml'
        fileExtension = 'xml'
        break
      case 'spdx-tag-value':
        contentType = 'text/plain'
        fileExtension = 'spdx'
        break
      case 'table':
      case 'text':
        contentType = 'text/plain'
        fileExtension = 'txt'
        break
      case 'syft-json':
        fileExtension = 'syft.json'
        break
    }

    const fileName = `sbom-${image.replace(/[/:]/g, '-')}.${fileExtension}`

    return new NextResponse(sbomContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
}