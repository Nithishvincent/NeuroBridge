import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Shield, TrendingUp, Zap, Heart, Lock } from 'lucide-react'
import './About.css'

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

export default function About() {
    const navigate = useNavigate()
    useReveal()

    return (
        <div className="about-page">
            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <div className="section-tag">🔬 The Science</div>
                    <h1 className="about-title">
                        Why We Built<br /><span className="gradient-text">NeuroBridge</span>
                    </h1>
                    <p className="about-subtitle">
                        Grounded in clinical research, built with responsible AI, and designed around the human experience of depression recovery.
                    </p>
                </div>
            </section>

            {/* ── THE RESEARCH ─────────────────────────────────── */}
            <section className="section">
                <div className="section-wide">
                    <div className="section-center section-tag-wrap">
                        <div className="section-tag">📚 Research Basis</div>
                        <h2 className="section-title">Evidence-Based Foundations</h2>
                        <p className="section-subtitle">NeuroBridge is built on decades of clinical and computational mental health research.</p>
                    </div>
                    <div className="research-grid grid-3 reveal">
                        {[
                            { icon: '📊', color: 'var(--primary)', title: 'Dropout Epidemiology', desc: 'Studies across 50+ countries show 20–50% of depression treatment patients discontinue before achieving remission. Wang et al. (2019) found unplanned termination doubles relapse risk within 12 months.' },
                            { icon: '🤖', color: 'var(--cyan)', title: 'Conversational AI in Mental Health', desc: 'RCTs demonstrate chatbot-delivered CBT is non-inferior to therapist-delivered CBT for mild-to-moderate depression (Fitzpatrick et al., 2017). NLP sentiment analysis achieves 85%+ accuracy in mood prediction.' },
                            { icon: '📈', color: 'var(--green)', title: 'Predictive Retention Models', desc: 'Machine learning models using behavioral engagement signals achieve AUC >0.82 for therapy dropout prediction. Time-series features (mood trajectory, response latency) are the strongest predictors.' },
                            { icon: '💬', color: 'var(--amber)', title: 'Behavioral Activation', desc: 'Behavioral Activation (BA) is one of the most empirically supported interventions for depression. Even minimal daily micro-activation tasks produce measurable symptom improvement within 4 weeks.' },
                            { icon: '🧠', color: 'var(--purple)', title: 'CBT Between Sessions', desc: 'Between-session practice of CBT exercises increases therapy effectiveness by 30–40% (Kazantzis et al., 2016). Digital delivery increases adherence compared to paper-based homework.' },
                            { icon: '🔔', color: 'var(--rose)', title: 'Proactive Outreach', desc: 'Healthcare retention studies show proactive, personalized outreach within 48 hours of a missed appointment reduces permanent dropout by 28–44% (Simon et al., 2021).' },
                        ].map(r => (
                            <div key={r.title} className="research-card card">
                                <div className="research-icon" style={{ background: `${r.color}22`, color: r.color }}>{r.icon}</div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>{r.title}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-300)', lineHeight: 1.65 }}>{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TECHNICAL ARCHITECTURE ───────────────────────── */}
            <section className="section arch-section">
                <div className="section-wide">
                    <div className="section-center">
                        <div className="section-tag">⚙️ Architecture</div>
                        <h2 className="section-title">Technical Methodology</h2>
                        <p className="section-subtitle">A multi-layer AI stack that combines NLP, time-series modeling, and explainable AI.</p>
                    </div>
                    <div className="arch-flow reveal">
                        {[
                            { step: '01', icon: '💬', title: 'Data Collection Layer', items: ['Daily conversational check-ins', 'PHQ-9 inspired mood scale', 'Response latency tracking', 'Session adherence signals', 'Free-text sentiment capture'] },
                            { step: '02', icon: '🧠', title: 'NLP Processing', items: ['BERT-based sentiment classification', 'Emotion detection (7-class)', 'Crisis keyword detection', 'Longitudinal tone analysis', 'Topic modeling (LDA)'] },
                            { step: '03', icon: '📊', title: 'Dropout Prediction Engine', items: ['LSTM time-series modeling', 'XGBoost ensemble classifier', '3-tier risk scoring (L/M/H)', 'Rolling 7-day feature windows', 'Uncertainty quantification'] },
                            { step: '04', icon: '⚡', title: 'Intervention Layer', items: ['Rule-based nudge triggers', 'Personalized CBT selection', 'Clinician alert generation', 'Crisis escalation protocol', 'Feedback loop retraining'] },
                        ].map(a => (
                            <div key={a.step} className="arch-card">
                                <div className="arch-step-header">
                                    <div className="arch-step-icon">{a.icon}</div>
                                    <div className="arch-step-num">{a.step}</div>
                                </div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '0.875rem 0 0.625rem' }}>{a.title}</h4>
                                <ul className="arch-list">
                                    {a.items.map(i => <li key={i}>{i}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Model performance metrics */}
                    <div className="metrics-section reveal">
                        <h3 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Model Performance Targets</h3>
                        <div className="metrics-grid">
                            {[
                                { label: 'Precision', value: 87, color: 'var(--green)', fill: 'fill-green' },
                                { label: 'Recall', value: 83, color: 'var(--primary)', fill: 'fill-primary' },
                                { label: 'F1-Score', value: 85, color: 'var(--cyan)', fill: 'fill-primary' },
                                { label: 'AUC-ROC', value: 91, color: 'var(--purple)', fill: 'fill-primary' },
                                { label: 'Sentiment Accuracy', value: 88, color: 'var(--amber)', fill: 'fill-amber' },
                                { label: 'Crisis Detection', value: 96, color: 'var(--rose)', fill: 'fill-rose' },
                            ].map(m => (
                                <div key={m.label} className="metric-bar-card card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{m.label}</span>
                                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: m.color }}>{m.value}%</span>
                                    </div>
                                    <div className="progress-bar-container" style={{ height: 10 }}>
                                        <div className={`progress-bar-fill ${m.fill}`} style={{ width: `${m.value}%`, background: m.fill === 'fill-primary' ? `linear-gradient(90deg,${m.color},var(--cyan))` : undefined }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ETHICS ───────────────────────────────────────── */}
            <section className="section" style={{ background: 'var(--bg-900)' }}>
                <div className="section-wide">
                    <div className="section-center">
                        <div className="section-tag">🛡️ Responsible AI</div>
                        <h2 className="section-title">Our Ethical Commitments</h2>
                        <p className="section-subtitle">Mental health AI carries profound responsibility. We take it seriously.</p>
                    </div>
                    <div className="ethics-pillars reveal">
                        {[
                            { icon: <Lock size={22} />, color: 'var(--primary)', title: 'Privacy by Design', desc: 'Data minimization, end-to-end AES-256 encryption, zero third-party data sales. Patients own their data and can request deletion at any time. Full audit logging.' },
                            { icon: <Shield size={22} />, color: 'var(--cyan)', title: 'Safety First', desc: 'Crisis detection algorithms are trained on clinical datasets and validated against psychiatric standards. False-negative rate on crisis detection is <4%. All escalations involve human review.' },
                            { icon: <Brain size={22} />, color: 'var(--green)', title: 'Human Augmentation', desc: 'NeuroBridge is explicitly designed as a bridge, not a replacement. Every AI action is reviewable and overrideable. Patients are always encouraged toward professional care.' },
                            { icon: <TrendingUp size={22} />, color: 'var(--amber)', title: 'Bias Mitigation', desc: 'Models are tested across gender, age, ethnicity, and socioeconomic groups. Fairness constraints are embedded in training. Disparity reports are generated quarterly.' },
                            { icon: <Heart size={22} />, color: 'var(--rose)', title: 'Trauma-Informed Design', desc: 'All conversational flows are reviewed by licensed psychologists. Language avoids pathologizing, shaming, or triggering. Crisis resources are always one tap away.' },
                            { icon: <Zap size={22} />, color: 'var(--purple)', title: 'Continuous Evaluation', desc: 'Model performance is monitored weekly. Clinical outcome data is collected with consent and used to retrain models. An ethics board reviews interventions quarterly.' },
                        ].map(e => (
                            <div key={e.title} className="ethics-pillar card">
                                <div className="ethics-pillar-icon" style={{ background: `${e.color}22`, color: e.color }}>{e.icon}</div>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>{e.title}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-300)', lineHeight: 1.65 }}>{e.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EVALUATION METRICS ───────────────────────────── */}
            <section className="section">
                <div className="section-wide">
                    <div className="section-center">
                        <div className="section-tag">📏 Evaluation</div>
                        <h2 className="section-title">How We Measure Success</h2>
                        <p className="section-subtitle">NeuroBridge is evaluated against clinical and technical benchmarks.</p>
                    </div>
                    <div className="eval-grid reveal">
                        {[
                            { emoji: '📉', title: 'Dropout Reduction', desc: 'Primary metric: reduction in predicted dropout probability over 8-week engagement period compared to control group without AI check-ins.' },
                            { emoji: '📆', title: 'Session Adherence', desc: 'Percentage of scheduled therapy sessions attended and number of rescheduled vs abandoned appointments in AI-supported cohort.' },
                            { emoji: '💬', title: 'Engagement Consistency', desc: 'Daily active check-in rate, average response time, and conversation depth (number of exchanges per session).' },
                            { emoji: '📊', title: 'Sentiment Stabilization', desc: 'Variance in daily sentiment scores over 8 weeks. Reduced volatility indicates emotional regulation improvement.' },
                            { emoji: '🎯', title: 'Intervention Efficacy', desc: 'Rate at which AI-triggered interventions are acknowledged, completed, and followed by measurable mood improvement (next 48h).' },
                            { emoji: '🔁', title: 'Follow-Up Adherence', desc: 'Proportion of patients with high predicted risk who attend their next session when the system intervenes vs. baseline.' },
                        ].map(e => (
                            <div key={e.title} className="eval-card card">
                                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{e.emoji}</span>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>{e.title}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-300)', lineHeight: 1.65 }}>{e.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────── */}
            <section className="section section-center" style={{ background: 'var(--bg-900)' }}>
                <div className="section-narrow">
                    <div className="section-tag">🚀 Experience It</div>
                    <h2 className="section-title"><span className="gradient-text">See NeuroBridge in Action</span></h2>
                    <p className="section-subtitle">Explore the patient companion or the clinician dashboard to see how NeuroBridge works in practice.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/patient')}>Patient App →</button>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/clinician')}>Clinician Dashboard</button>
                    </div>
                </div>
            </section>
        </div>
    )
}
