import { pdfjs } from 'react-pdf';

// Use Vite's ?url to import worker from node_modules (no CDN dependency)
import Worker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = Worker;