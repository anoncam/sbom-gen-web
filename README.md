# SBOM Generator Web Application

A modern web application for generating Software Bill of Materials (SBOM) and scanning container images for vulnerabilities.

## Features

- **SBOM Generation**: Generate SBOMs in multiple formats (JSON, SPDX, CycloneDX, etc.) using Syft
- **Vulnerability Scanning**: Scan container images using both Grype and OSV-Scanner
- **Modern UI**: Clean, responsive dark theme interface
- **Multiple Format Support**: Download SBOMs in various industry-standard formats
- **Real-time Analysis**: Live progress updates during analysis
- **Security**: Rate limiting and security headers implemented

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for testing container images)

The application will automatically install the following tools if not present:
- Syft (for SBOM generation)
- Grype (for vulnerability scanning)
- OSV-Scanner (for additional vulnerability scanning)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sbom-gen-web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a container image specification (e.g., `alpine:latest`, `nginx:1.21`, `ghcr.io/owner/image:tag`)
2. Click "Analyze Image" to start the analysis
3. View and download generated SBOMs in various formats
4. Review vulnerability scan results from both Grype and OSV-Scanner
5. Download detailed vulnerability reports

## Supported SBOM Formats

- **JSON**: Standard JSON format
- **SPDX**: Software Package Data Exchange format (JSON and Tag-Value)
- **CycloneDX**: OWASP CycloneDX format (JSON and XML)
- **Syft JSON**: Native Syft format with detailed metadata
- **Table/Text**: Human-readable formats

## API Endpoints

### POST /api/analyze
Analyzes a container image and generates SBOMs and vulnerability reports.

**Request Body:**
```json
{
  "image": "alpine:latest"
}
```

### POST /api/download/sbom
Downloads a specific SBOM format.

**Request Body:**
```json
{
  "image": "alpine:latest",
  "format": "spdx-json",
  "sessionId": "..."
}
```

### POST /api/download/vulnerability-report
Downloads vulnerability scan results.

**Request Body:**
```json
{
  "image": "alpine:latest",
  "scanner": "grype",
  "sessionId": "..."
}
```

## Security Features

- **Rate Limiting**: 10 requests per minute per IP/endpoint
- **Input Validation**: Strict validation of container image specifications
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Session Management**: Temporary session-based storage with automatic cleanup

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Install scanning tools
RUN apk add --no-cache curl bash
RUN curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin
RUN curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables

```env
NODE_ENV=production
PORT=3000
```

## Architecture

- **Frontend**: Next.js 14+ with React and TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Backend**: Next.js API Routes
- **SBOM Generation**: Syft
- **Vulnerability Scanning**: Grype and OSV-Scanner
- **State Management**: React hooks with session-based backend storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Acknowledgments

- [Syft](https://github.com/anchore/syft) by Anchore
- [Grype](https://github.com/anchore/grype) by Anchore
- [OSV-Scanner](https://github.com/google/osv-scanner) by Google
- [Next.js](https://nextjs.org/) by Vercel