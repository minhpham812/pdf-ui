import { useState, useRef, useCallback, type ChangeEvent } from 'react'
import { PdfViewer } from './components/pdf'

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const cleanupUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    cleanupUrl()
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setPdfUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || file.type !== 'application/pdf') return

    cleanupUrl()
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setPdfUrl(url)
  }

  if (!pdfUrl) {
    return (
      <div
        className="pdf-uploader"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="pdf-uploader__content">
          <div className="pdf-uploader__icon">📄</div>
          <h2>PDF Viewer</h2>
          <p>Drop a PDF file here, or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <PdfViewer file={pdfUrl} />
    </div>
  )
}

export default App
