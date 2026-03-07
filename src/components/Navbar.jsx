import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Brain, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const links = [
        { to: '/', label: 'Home' },
        { to: '/patient', label: 'Patient App' },
        { to: '/clinician', label: 'Clinician Dashboard' },
        { to: '/about', label: 'About' },
    ]

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <NavLink to="/" className="nav-logo">
                    <div className="nav-logo-icon"><Brain size={18} color="#fff" /></div>
                    <span className="nav-logo-text">NeuroBridge</span>
                </NavLink>

                <ul className="nav-links">
                    {links.map(l => (
                        <li key={l.to}>
                            <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end>
                                {l.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/clinician')}>Clinician View</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient')}>Try Patient App</button>
                </div>

                <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                    <Menu size={22} color="var(--text-200)" />
                </button>
            </nav>

            {/* Mobile overlay */}
            <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                <button className="mobile-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                    <X size={26} />
                </button>
                {links.map(l => (
                    <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</NavLink>
                ))}
                <button className="btn btn-primary btn-lg" onClick={() => { setMobileOpen(false); navigate('/patient') }}>Try Patient App</button>
            </div>
        </>
    )
}
