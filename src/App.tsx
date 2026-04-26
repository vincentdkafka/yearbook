import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateBookPage from './pages/CreateBookPage'
import BookPage from './pages/BookPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateBookPage />} />
        <Route path="/book/:slug" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App