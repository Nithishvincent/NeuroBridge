import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NeuralBackground from './components/NeuralBackground'
import Landing from './pages/Landing'
import Patient from './pages/Patient'
import Clinician from './pages/Clinician'
import About from './pages/About'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <NeuralBackground />
      <Navbar />
      <main style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/clinician" element={<Clinician />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
