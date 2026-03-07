import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Brain, Shield, TrendingUp, Zap, ChevronRight, Activity } from 'lucide-react'
import './Landing.css'

/* ── Animated counter hook ────────────────────────────────── */
function useCounter(target, decimals = 0, suffix = '', duration = 2000) {
    const [value, setValue] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            observer.disconnect()
            const start = performance.now()
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1)
                const eased = 1 - Math.pow(1 - p, 3)
                setValue(parseFloat((eased * target).toFixed(decimals)))
                if (p < 1) ref.current = requestAnimationFrame(tick)
            }
            ref.current = requestAnimationFrame(tick)
        }, { threshold: 0.5 })
        const el = document.getElementById('stats-anchor')
        if (el) observer.observe(el)
        return () => { observer.disconnect(); cancelAnimationFrame(ref.current) }
    }, [target, decimals, duration])

    return value + suffix
}

/* ── Scroll Reveal hook ───────────────────────────────────── */
function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal')
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target) } })
        }, { threshold: 0.1 })
        els.forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])
}

/* ── Stats ────────────────────────────────────────────────── */
function StatItem({ target, suffix, label, color, decimals }) {
    const val = useCounter(target, decimals, suffix)
    return (
        <div className="stat-item">
            <div className="stat-number" style={{ color }}>{val}</div>
            <div className="stat-label">{label}</div>
        </div>
    )
}

export default function Landing() {
    const navigate = useNavigate()
    useReveal()

    return (
        <div className="landing-page">
            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <span className="eyebrow-dot" />
                        AI-Powered Mental Health Retention · Built for India
                    </div>
                    <h1 className="hero-headline">
                        <span className="gradient-text">Predict. Prevent.</span>
                        <br />Preserve Recovery.
                    </h1>
                    <p className="hero-subheadline">
                        NeuroBridge bridges the gap between therapy sessions — using AI to detect dropout risk
                        before it happens, supporting patients across India's diverse languages and cultures.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/patient')}>
                            Try Patient App <ArrowRight size={18} />
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/clinician')}>
                            Clinician Dashboard
                        </button>
                    </div>
                    <div className="hero-trust">
                        <div className="hero-trust-item"><Shield size={15} />DISHA Act Aligned</div>
                        <div className="hero-trust-item"><Brain size={15} />Evidence-Based CBT</div>
                        <div className="hero-trust-item"><Activity size={15} />24/7 AI Support</div>
                        <div className="hero-trust-item"><Zap size={15} />7 Indian Languages</div>
                    </div>
                </div>

                {/* Preview card */}
                <div className="hero-visual">
                    <div className="hero-preview-card">
                        <div className="preview-top-bar">
                            <div className="preview-dots"><span /><span /><span /></div>
                            <span className="preview-title">NeuroBridge Patient Dashboard</span>
                            <span className="badge badge-green"><span className="dot dot-green" style={{ animation: 'pulse-dot 1.8s infinite' }} /> Live</span>
                        </div>
                        <div className="preview-metrics">
                            <div className="metric-chip">
                                <div className="metric-label">Mood Score</div>
                                <div className="metric-value" style={{ color: 'var(--green)' }}>7.4 / 10</div>
                            </div>
                            <div className="metric-chip">
                                <div className="metric-label">Dropout Risk</div>
                                <div className="metric-value" style={{ color: 'var(--amber)' }}>28%</div>
                            </div>
                            <div className="metric-chip">
                                <div className="metric-label">Streak</div>
                                <div className="metric-value" style={{ color: 'var(--cyan)' }}>12 days</div>
                            </div>
                            <div className="metric-chip">
                                <div className="metric-label">Next Session</div>
                                <div className="metric-value" style={{ color: 'var(--primary-light)' }}>Tomorrow</div>
                            </div>
                        </div>
                        <div className="preview-chat-area">
                            <div className="preview-msg ai">
                                <div className="preview-avatar-ai">🧠</div>
                                <div className="preview-bubble-ai">Good morning! How are you feeling today on a scale of 1–10?</div>
                            </div>
                            <div className="preview-msg user">
                                <div className="preview-bubble-user">Maybe a 6. Feeling a bit anxious before work.</div>
                                <div className="preview-avatar-user">😊</div>
                            </div>
                            <div className="preview-msg ai">
                                <div className="preview-avatar-ai">🧠</div>
                                <div className="preview-bubble-ai">I hear you. Let's try a quick grounding exercise — notice 5 things you can see around you right now.</div>
                            </div>
                            <div className="typing-indicator">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ──────────────────────────────────── */}
            <section className="stats-strip" id="stats-anchor">
                <div className="stats-grid">
                    <StatItem target={197} suffix="M" label="Indians affected by MDD or anxiety (NMHP 2023)" color="var(--rose)" />
                    <StatItem target={83} suffix="%" label="mental health treatment gap across India" color="var(--amber)" />
                    <StatItem target={50} suffix="%" label="of patients drop out before remission" color="var(--purple)" />
                    <StatItem target={0.75} suffix=" / lakh" label="psychiatrists in India vs 3.1 global average" color="var(--cyan)" decimals={2} />
                </div>
            </section>

            {/* ── PROBLEM ──────────────────────────────────────── */}
            <section className="section problem-section">
                <div className="section-wide">
                    <div className="section-center">
                        <div className="section-tag">🎯 The Problem</div>
                        <h2 className="section-title">The Silent Crisis in Mental Healthcare</h2>
                        <p className="section-subtitle">Depression treatment is undermined by a structural challenge that compounds suffering and overwhelms the system.</p>
                    </div>
                    <div className="problem-cards reveal">
                        {[
                            { icon: '🇮🇳', color: 'var(--rose)', bg: 'rgba(244,63,94,0.12)', title: "India's Mental Health Gap", desc: '197 million Indians live with depression or anxiety, yet 83% receive no treatment. With only 0.75 psychiatrists per lakh population — versus 3.1 globally — sustained care is out of reach for most (NMHP 2023).', stat: '83% treatment gap · NMHP 2023' },
                            { icon: '⏳', color: 'var(--amber)', bg: 'rgba(245,158,11,0.12)', title: 'The Session Gap', desc: 'Weeks between sessions create unmonitored windows where motivation collapses. Cultural stigma in India makes re-engagement especially difficult once a patient steps away.', stat: '14–21 day unmonitored gaps' },
                            { icon: '🗣️', color: 'var(--purple)', bg: 'rgba(168,85,247,0.12)', title: 'Language Barriers in Care', desc: "India has 22 official languages, yet most mental health apps operate in English only. Patients struggle to express distress in clinical settings that don't reflect their mother tongue.", stat: '>90% of apps English-only' },
                        ].map(c => (
                            <div key={c.title} className="problem-card">
                                <div className="problem-icon" style={{ background: c.bg }}>
                                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                                </div>
                                <h3>{c.title}</h3>
                                <p>{c.desc}</p>
                                <div className="problem-stat" style={{ color: c.color, borderColor: c.color + '44' }}>{c.stat}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SOLUTION ─────────────────────────────────────── */}
            <section className="section solution-section">
                <div className="section-wide">
                    <div className="section-center">
                        <div className="section-tag">💡 The Solution</div>
                        <h2 className="section-title">Three Pillars of Continuous Care</h2>
                        <p className="section-subtitle">NeuroBridge transforms episodic therapy into an always-on intelligent support ecosystem.</p>
                    </div>

                    {/* Feature 1 */}
                    <div className="solution-feature reveal">
                        <div className="solution-feature-info">
                            <div className="solution-number">01 — Conversational AI</div>
                            <h3>Your AI Companion Between Sessions</h3>
                            <p>A 24/7 intelligent chatbot conducts structured mood check-ins, detects emotional tone through NLP, and delivers evidence-based micro-interventions — CBT exercises, behavioral activation prompts, and grounding techniques — adapted to your real-time state.</p>
                            <div className="feature-tags">
                                <span className="badge badge-primary">CBT Techniques</span>
                                <span className="badge badge-cyan">NLP Sentiment</span>
                                <span className="badge badge-purple">Adaptive Responses</span>
                                <span className="badge badge-rose">Crisis Detection</span>
                            </div>
                        </div>
                        <div className="solution-visual">
                            <div className="chat-visual-msg ai">
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>🧠</div>
                                <div className="chat-visual-bubble ai">How has your energy been since our last check-in? I noticed you skipped yesterday's session.</div>
                            </div>
                            <div className="chat-visual-msg user">
                                <div className="chat-visual-bubble user">I've been really tired. Didn't feel like talking.</div>
                            </div>
                            <div className="chat-visual-msg ai">
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>🧠</div>
                                <div className="chat-visual-bubble ai">That's okay — fatigue is a real signal worth paying attention to. Let's try behavioral activation: can you name one small thing that used to bring you joy?</div>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                <span className="badge badge-amber">⚠️ Disengagement Signal Detected</span>
                                <span className="badge badge-rose">🔔 Clinician Notified</span>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="solution-feature reveal reverse-feature">
                        <div className="solution-feature-info">
                            <div className="solution-number">02 — Predictive Modeling</div>
                            <h3>Know Who's At Risk Before They Leave</h3>
                            <p>Machine learning models trained on behavioral signals — daily mood trends, response latency, interaction frequency, inactivity periods, and symptom progression — generate individualized dropout risk scores in real time.</p>
                            <div className="feature-tags">
                                <span className="badge badge-green">Time-Series ML</span>
                                <span className="badge badge-cyan">Ensemble Models</span>
                                <span className="badge badge-amber">3 Risk Tiers</span>
                                <span className="badge badge-purple">Explainable AI</span>
                            </div>
                        </div>
                        <div className="solution-visual">
                            <div className="risk-visual-header">
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>Dropout Risk Model</span>
                                <span className="badge badge-amber">Moderate Risk</span>
                            </div>
                            {[
                                { label: 'Mood Trend (7-day)', value: 55, color: 'var(--amber)', fill: 'fill-amber' },
                                { label: 'Interaction Frequency', value: 35, color: 'var(--rose)', fill: 'fill-rose' },
                                { label: 'Session Adherence', value: 70, color: 'var(--green)', fill: 'fill-green' },
                                { label: 'NLP Sentiment Score', value: 48, color: 'var(--amber)', fill: 'fill-amber' },
                            ].map(r => (
                                <div key={r.label} className="risk-row">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-300)' }}>{r.label}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: r.color }}>{r.value}%</span>
                                    </div>
                                    <div className="progress-bar-container"><div className={`progress-bar-fill ${r.fill}`} style={{ width: `${r.value}%` }} /></div>
                                </div>
                            ))}
                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.8rem', color: 'var(--amber)' }}>
                                ⚡ Predicted dropout probability: <strong>42%</strong> — Intervention recommended
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="solution-feature reveal">
                        <div className="solution-feature-info">
                            <div className="solution-number">03 — Clinician Command Center</div>
                            <h3>Actionable Insights for Care Teams</h3>
                            <p>When elevated risk is detected, NeuroBridge triggers targeted interventions and surfaces explainable AI insights to clinicians — engagement graphs, mood heatmaps, and risk probabilities — enabling timely human intervention before dropout occurs.</p>
                            <div className="feature-tags">
                                <span className="badge badge-primary">Clinician Dashboard</span>
                                <span className="badge badge-cyan">Mood Heatmap</span>
                                <span className="badge badge-green">Auto-Nudges</span>
                                <span className="badge badge-purple">XAI Reports</span>
                            </div>
                        </div>
                        <div className="solution-visual">
                            {[
                                { icon: '🔔', text: 'Session reminder sent to Maya R. — appointment tomorrow at 3PM', type: 'info', badge: 'Nudge Sent' },
                                { icon: '💪', text: 'Motivational message delivered: "You\'ve made real progress. One session at a time."', type: 'success', badge: 'Behavioral' },
                                { icon: '🧘', text: 'CBT thought-record exercise suggested based on anxiety spike detected', type: 'info', badge: 'CBT' },
                                { icon: '🚨', text: 'Crisis keyword detected — emergency resources escalated to patient and clinician', type: 'danger', badge: 'Crisis' },
                            ].map((item, i) => (
                                <div key={i} className={`intervention-item intervention-${item.type}`}>
                                    <span className="intervention-icon">{item.icon}</span>
                                    <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-200)' }}>{item.text}</span>
                                    <span className={`badge badge-${item.type === 'danger' ? 'rose' : item.type === 'success' ? 'green' : 'cyan'}`}>{item.badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────── */}
            <section className="section how-section">
                <div className="section-wide section-center">
                    <div className="section-tag">⚙️ Process</div>
                    <h2 className="section-title">How NeuroBridge Works</h2>
                    <p className="section-subtitle">A seamless four-step loop that keeps patients connected and clinicians informed.</p>
                    <div className="steps-row reveal">
                        {[
                            { n: 1, icon: '💬', title: 'Daily Check-In', desc: 'Patient interacts with the AI companion. Mood, energy, and thoughts are captured naturally through conversation.' },
                            { n: 2, icon: '🧠', title: 'AI Analysis', desc: 'NLP processes sentiment and behavioral signals. The ML model updates the individualized dropout risk score in real time.' },
                            { n: 3, icon: '⚡', title: 'Smart Intervention', desc: 'If risk exceeds threshold, personalized nudges, coping exercises, or reminders are delivered automatically.' },
                            { n: 4, icon: '👩‍⚕️', title: 'Clinician Insight', desc: 'The care team dashboard surfaces risk alerts, engagement trends, and AI-generated session preparation notes.' },
                        ].map(s => (
                            <div key={s.n} className="step-card">
                                <div className="step-icon">{s.icon}</div>
                                <div className="step-number-badge">{s.n}</div>
                                <h4>{s.title}</h4>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ETHICS ───────────────────────────────────────── */}
            <section className="section ethics-section">
                <div className="section-wide section-center">
                    <div className="section-tag">🛡️ Ethics & Safety</div>
                    <h2 className="section-title">Built Responsibly from the Ground Up</h2>
                    <p className="section-subtitle">NeuroBridge is designed as an augmentation tool, not a replacement for professional care.</p>
                    <div className="ethics-grid reveal">
                        {[
                            { icon: '🔐', title: 'End-to-End Encryption', desc: 'All patient data is encrypted at rest and in transit using AES-256. Zero data sold to third parties.' },
                            { icon: '⚖️', title: 'Bias Mitigation', desc: 'Models are tested across demographic groups and retrained with fairness constraints to prevent discriminatory outcomes.' },
                            { icon: '🚨', title: 'Crisis Escalation', desc: 'Detects suicidal ideation in 7 Indian languages. Instantly surfaces iCall (9152987821), Vandrevala Foundation, and NIMHANS helplines. Clinician notified.' },
                            { icon: '🧑‍⚕️', title: 'Human-in-the-Loop', desc: 'Every AI recommendation is reviewable and overrideable by clinicians. The system augments, never replaces, clinical judgment.' },
                            { icon: '📋', title: 'DISHA Act Aligned', desc: "Architecture follows India's Digital Information in Healthcare Security Act (DISHA) guidelines, with full consent management and audit logging." },
                            { icon: '🎯', title: 'Augmentation First', desc: 'NeuroBridge is a bridge between sessions — patients are always encouraged to attend and maintain professional care.' },
                        ].map(e => (
                            <div key={e.title} className="ethics-card card">
                                <div className="ethics-icon">{e.icon}</div>
                                <h4>{e.title}</h4>
                                <p>{e.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="cta-section">
                <div className="cta-glow" />
                <div className="cta-inner section-center">
                    <div className="section-tag">🚀 Get Started</div>
                    <h2 className="cta-headline">
                        Ready to Transform<br /><span className="gradient-text">Therapy Outcomes?</span>
                    </h2>
                    <p className="cta-sub">
                        Explore the patient experience or see how NeuroBridge empowers clinical teams with predictive intelligence.
                    </p>
                    <div className="cta-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/patient')}>
                            Try Patient App <ArrowRight size={18} />
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/clinician')}>
                            Clinician Dashboard <ChevronRight size={18} />
                        </button>
                        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/about')}>
                            Learn the Science
                        </button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-400)', marginTop: '2rem' }}>
                        🔒 Demo only. No real patient data. Not a replacement for professional care.
                    </p>
                </div>
            </section>
        </div>
    )
}
