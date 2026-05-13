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
        className="flex items-center justify-center min-h-screen p-8 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-4 p-16 text-center border-2 border-dashed rounded-2xl border-border bg-surface hover:border-accent hover:bg-accent-bg transition-all duration-200">
          <div className="text-[200px] leading-none select-none pointer-events-none">📄</div>
          <h2 className="text-2xl font-semibold text-text-heading m-0">PDF Viewer</h2>
          <p className="text-sm text-text m-0">Drop a PDF file here, or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen">
      <PdfViewer.Root url={pdfUrl} initialScale={1} className="w-screen h-screen">
        <PdfViewer.Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <PdfViewer.Thumbnails />
          <div className="relative flex flex-col items-center flex-1 bg-[#525659] overflow-hidden">
            <div className="flex flex-col items-center flex-1 p-4 overflow-auto w-full">
              <PdfViewer.Pages />
            </div>
            <PdfViewer.HighlightTool />
            <PdfViewer.DrawingTool />
          </div>
        </div>
      </PdfViewer.Root>
    </div>
  )
}

export default App
