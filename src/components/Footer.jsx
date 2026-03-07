import { Link } from 'react-router-dom'
import { Brain } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,var(--primary),var(--cyan))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Brain size={16} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg,var(--text-100),var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NeuroBridge</span>
                    </div>
                    <p>AI-powered therapy retention engine bridging the gap between sessions to prevent dropout and support recovery.</p>
                </div>

                <div className="footer-col">
                    <h4>Platform</h4>
                    <ul>
                        <li><Link to="/patient">Patient Dashboard</Link></li>
                        <li><Link to="/clinician">Clinician View</Link></li>
                        <li><Link to="/about">About & Science</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Features</h4>
                    <ul>
                        <li><a href="#">AI Companion</a></li>
                        <li><a href="#">Mood Tracking</a></li>
                        <li><a href="#">Risk Prediction</a></li>
                        <li><a href="#">Crisis Support</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Ethics & Safety</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Data Security</a></li>
                        <li><a href="#">Bias Mitigation</a></li>
                        <li><a href="#">Crisis Protocol</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2025 NeuroBridge. For demonstration purposes. Not a replacement for professional care.</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="dot dot-green" style={{ animation: 'pulse-dot 2s infinite' }}></span>
                    System operational
                </span>
            </div>
        </footer>
    )
}
