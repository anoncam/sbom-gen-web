interface SBOMResultsProps {
  sboms: Record<string, any>
  image: string
  sessionId: string | null
}

export default function SBOMResults({ sboms, image, sessionId }: SBOMResultsProps) {
  const formatLabels: Record<string, string> = {
    json: 'JSON',
    spdx: 'SPDX',
    'spdx-json': 'SPDX JSON',
    'cyclonedx-json': 'CycloneDX JSON',
    'cyclonedx-xml': 'CycloneDX XML',
    syft: 'Syft JSON',
    table: 'Table',
    text: 'Text',
  }

  const formatIcons: Record<string, JSX.Element> = {
    json: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    spdx: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>,
    'cyclonedx-json': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    'cyclonedx-xml': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
  }

  const handleDownload = async (format: string) => {
    try {
      const response = await fetch(`/api/download/sbom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image, 
          format,
          sessionId 
        }),
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sbom-${image.replace(/[/:]/g, '-')}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-300">
        Software Bill of Materials generated in multiple formats. Click to download:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(sboms).map((format) => (
          <button
            key={format}
            onClick={() => handleDownload(format)}
            className="group bg-surface hover:bg-surface-light border border-white/10 hover:border-primary/50 rounded-lg p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">
                {formatLabels[format] || format.toUpperCase()}
              </span>
              <div className="text-primary group-hover:text-primary-dark transition">
                {formatIcons[format] || formatIcons.json}
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400">
                {sboms[format]?.packageCount ? `${sboms[format].packageCount} packages` : 'Ready to download'}
              </p>
              {sboms[format]?.size && (
                <p className="text-xs text-gray-500 mt-1">
                  Size: {(sboms[format].size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-surface rounded-lg border border-white/10">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Format Information</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <strong>SPDX:</strong> Standard format for compliance and license management</li>
          <li>• <strong>CycloneDX:</strong> Modern format optimized for supply chain security</li>
          <li>• <strong>JSON:</strong> Machine-readable format for automation</li>
          <li>• <strong>Syft:</strong> Native Syft format with detailed metadata</li>
        </ul>
      </div>
    </div>
  )
}