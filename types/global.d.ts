declare global {
  var analysisResults: Record<string, {
    image: string
    sboms: Record<string, any>
    vulnerabilities: any
    tempDir: string
    createdAt: string
  }> | undefined
}

export {}