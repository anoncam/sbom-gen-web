import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const execAsync = promisify(exec)

const SYFT_FORMATS = [
  'json',
  'spdx-json', 
  'spdx-tag-value',
  'cyclonedx-json',
  'cyclonedx-xml',
  'syft-json',
  'table',
  'text'
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image specification is required' },
        { status: 400 }
      )
    }

    // Validate image format
    const imageRegex = /^[a-z0-9]+(?:[._\-\/][a-z0-9]+)*(?::[a-z0-9]+(?:[._\-][a-z0-9]+)*)?$/i
    if (!imageRegex.test(image)) {
      return NextResponse.json(
        { error: 'Invalid image specification format' },
        { status: 400 }
      )
    }

    // Create temp directory for this analysis
    const sessionId = crypto.randomBytes(16).toString('hex')
    const tempDir = path.join(process.cwd(), 'temp', sessionId)
    await mkdir(tempDir, { recursive: true })

    try {
      // Check if Syft is installed
      await execAsync('which syft')
    } catch {
      // Install Syft if not present
      console.log('Installing Syft...')
      await execAsync('curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin')
    }

    const sboms: Record<string, any> = {}
    
    // Generate SBOMs in all formats
    for (const format of SYFT_FORMATS) {
      try {
        const outputFile = path.join(tempDir, `sbom.${format.replace('-', '.')}`)
        const { stdout, stderr } = await execAsync(
          `syft ${image} -o ${format} > "${outputFile}"`,
          { maxBuffer: 1024 * 1024 * 10 } // 10MB buffer
        )
        
        if (stderr && !stderr.includes('WARNING')) {
          console.error(`Syft ${format} warning:`, stderr)
        }

        // Read the generated file
        const content = await readFile(outputFile, 'utf-8')
        sboms[format] = {
          content,
          size: content.length,
          packageCount: format.includes('json') ? 
            JSON.parse(content).artifacts?.length || 0 : 
            null
        }
      } catch (error) {
        console.error(`Failed to generate ${format} SBOM:`, error)
        sboms[format] = { error: 'Generation failed' }
      }
    }

    // Run vulnerability scanning
    let vulnerabilities: any = {}

    // Grype scan
    try {
      await execAsync('which grype')
    } catch {
      console.log('Installing Grype...')
      await execAsync('curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin')
    }

    try {
      const grypeOutput = path.join(tempDir, 'grype-results.json')
      await execAsync(
        `grype ${image} -o json > "${grypeOutput}"`,
        { maxBuffer: 1024 * 1024 * 10 }
      )
      
      const grypeResults = JSON.parse(await readFile(grypeOutput, 'utf-8'))
      vulnerabilities.grype = {
        vulnerabilities: grypeResults.matches || [],
        summary: {
          critical: grypeResults.matches?.filter((m: any) => m.vulnerability.severity === 'Critical').length || 0,
          high: grypeResults.matches?.filter((m: any) => m.vulnerability.severity === 'High').length || 0,
          medium: grypeResults.matches?.filter((m: any) => m.vulnerability.severity === 'Medium').length || 0,
          low: grypeResults.matches?.filter((m: any) => m.vulnerability.severity === 'Low').length || 0,
          unknown: grypeResults.matches?.filter((m: any) => m.vulnerability.severity === 'Unknown').length || 0,
        }
      }
    } catch (error) {
      console.error('Grype scan failed:', error)
    }

    // OSV Scanner
    try {
      await execAsync('which osv-scanner')
    } catch {
      console.log('Installing OSV Scanner...')
      await execAsync('go install github.com/google/osv-scanner/cmd/osv-scanner@latest')
    }

    try {
      // Use SBOM for OSV scanning
      const sbomFile = path.join(tempDir, 'sbom.json')
      const osvOutput = path.join(tempDir, 'osv-results.json')
      
      await execAsync(
        `osv-scanner --sbom "${sbomFile}" --format json > "${osvOutput}" 2>/dev/null || true`,
        { maxBuffer: 1024 * 1024 * 10 }
      )
      
      const osvResults = JSON.parse(await readFile(osvOutput, 'utf-8'))
      vulnerabilities.osv = {
        vulnerabilities: osvResults.results?.[0]?.packages || [],
        summary: {
          total: osvResults.results?.[0]?.packages?.length || 0
        }
      }
    } catch (error) {
      console.error('OSV scan failed:', error)
    }

    // Store results in session storage (in production, use Redis or similar)
    global.analysisResults = global.analysisResults || {}
    global.analysisResults[sessionId] = {
      image,
      sboms,
      vulnerabilities,
      tempDir,
      createdAt: new Date().toISOString()
    }

    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    for (const [id, data] of Object.entries(global.analysisResults || {})) {
      if (new Date(data.createdAt).getTime() < oneHourAgo) {
        await rm(data.tempDir, { recursive: true, force: true })
        delete global.analysisResults[id]
      }
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      sessionId,
      image,
      sboms: Object.keys(sboms).reduce((acc, key) => {
        acc[key] = {
          size: sboms[key].size,
          packageCount: sboms[key].packageCount,
          error: sboms[key].error
        }
        return acc
      }, {} as any),
      vulnerabilities,
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration
      }
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}