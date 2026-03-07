import { useState } from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js'
import { Search, Bell, TrendingDown, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import './Clinician.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend)

/* ── Mock Patient Data ──────────────────────────────────── */
const PATIENTS = [
    { id: 1, name: 'Maya Reddy', initials: 'MR', risk: 'moderate', riskScore: 42, mood: [5, 6, 4, 7, 6, 7, 6], engagement: [80, 65, 70, 55, 72, 68, 74], sessions: 14, lastActive: '2h ago', nextSession: 'Tomorrow', therapist: 'Dr. Mehta', diagnosis: 'MDD' },
    { id: 2, name: 'Arjun Sharma', initials: 'AS', risk: 'high', riskScore: 78, mood: [4, 3, 5, 3, 2, 4, 3], engagement: [60, 40, 35, 30, 45, 38, 32], sessions: 7, lastActive: '3 days', nextSession: 'Overdue', therapist: 'Dr. Mehta', diagnosis: 'Persistent DD' },
    { id: 3, name: 'Priya Nair', initials: 'PN', risk: 'low', riskScore: 18, mood: [7, 8, 7, 9, 8, 8, 9], engagement: [90, 88, 92, 85, 94, 90, 91], sessions: 22, lastActive: 'Today', nextSession: 'Thu', therapist: 'Dr. Kapoor', diagnosis: 'Anxiety + Depression' },
    { id: 4, name: 'Karan Verma', initials: 'KV', risk: 'high', riskScore: 85, mood: [3, 2, 4, 2, 3, 2, 3], engagement: [40, 25, 30, 22, 28, 20, 18], sessions: 4, lastActive: '5 days', nextSession: 'Missed', therapist: 'Dr. Singh', diagnosis: 'MDD' },
    { id: 5, name: 'Shruti Patel', initials: 'SP', risk: 'moderate', riskScore: 51, mood: [6, 5, 7, 5, 6, 5, 6], engagement: [65, 58, 70, 62, 68, 60, 64], sessions: 11, lastActive: 'Yesterday', nextSession: 'Fri', therapist: 'Dr. Mehta', diagnosis: 'Dysthymia' },
    { id: 6, name: 'Rohan Das', initials: 'RD', risk: 'low', riskScore: 22, mood: [8, 7, 8, 9, 7, 8, 8], engagement: [88, 85, 90, 82, 89, 86, 87], sessions: 18, lastActive: 'Today', nextSession: 'Wed', therapist: 'Dr. Kapoor', diagnosis: 'GAD + Depression' },
    { id: 7, name: 'Ananya Singh', initials: 'AN', risk: 'moderate', riskScore: 63, mood: [5, 4, 6, 4, 5, 6, 5], engagement: [55, 50, 60, 48, 58, 52, 56], sessions: 8, lastActive: 'Yesterday', nextSession: 'Thu', therapist: 'Dr. Singh', diagnosis: 'MDD' },
    { id: 8, name: 'Vikram Iyer', initials: 'VI', risk: 'low', riskScore: 12, mood: [9, 8, 9, 8, 9, 9, 8], engagement: [95, 92, 96, 90, 94, 93, 95], sessions: 30, lastActive: 'Today', nextSession: 'Mon', therapist: 'Dr. Mehta', diagnosis: 'Remission' },
]

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function riskConfig(risk) {
    if (risk === 'high') return { color: 'var(--rose)', dot: 'dot-rose', badge: 'badge-rose', label: 'High Risk' }
    if (risk === 'moderate') return { color: 'var(--amber)', dot: 'dot-amber', badge: 'badge-amber', label: 'Moderate' }
    return { color: 'var(--green)', dot: 'dot-green', badge: 'badge-green', label: 'Low Risk' }
}

function MoodHeatmap({ data }) {
    const flat = [...data, ...Array(28 - data.length).fill(null)]
    const colorFor = v => v === null ? 'rgba(255,255,255,0.04)' : v >= 8 ? '#10b981' : v >= 6 ? '#22d3ee' : v >= 4 ? '#f59e0b' : '#f43f5e'
    return (
        <div className="heatmap-grid">
            {flat.map((v, i) => (
                <div key={i} className="heatmap-cell" style={{ background: colorFor(v) }} title={v !== null ? `Day ${i + 1}: ${v}/10` : 'No data'} />
            ))}
        </div>
    )
}

function EngagementChart({ data }) {
    return <Bar
        data={{ labels: DAYS_SHORT, datasets: [{ data, backgroundColor: data.map(v => v >= 70 ? 'rgba(16,185,129,0.6)' : v >= 50 ? 'rgba(245,158,11,0.6)' : 'rgba(244,63,94,0.6)'), borderRadius: 6 }] }}
        options={{
            responsive: true, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,14,26,0.9)', titleColor: '#c8d3f5', bodyColor: '#8892b0' } },
            scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892b0', callback: v => v + '%' } }, x: { grid: { display: false }, ticks: { color: '#8892b0' } } }
        }}
    />
}

function MoodTrendChart({ data }) {
    return <Line
        data={{ labels: DAYS_SHORT, datasets: [{ data, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#818cf8', pointRadius: 4 }] }}
        options={{
            responsive: true, plugins: { legend: { display: false } },
            scales: { y: { min: 1, max: 10, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892b0', stepSize: 2 } }, x: { grid: { display: false }, ticks: { color: '#8892b0' } } }
        }}
    />
}

function RiskDonut() {
    const data = { labels: ['Low Risk', 'Moderate', 'High Risk'], datasets: [{ data: [4, 3, 1], backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)', 'rgba(244,63,94,0.7)'], borderColor: ['#10b981', '#f59e0b', '#f43f5e'], borderWidth: 2 }] }
    const options = { responsive: true, cutout: '68%', plugins: { legend: { labels: { color: '#8892b0', font: { size: 11 } } }, tooltip: { backgroundColor: 'rgba(10,14,26,0.9)', titleColor: '#c8d3f5', bodyColor: '#8892b0' } } }
    return <Doughnut data={data} options={options} />
}

/* Working Alliance Transformer (WAT) — Report Section: Computational Modeling */
function WATChart({ patientRisk }) {
    const baseScore = patientRisk === 'high' ? 48 : patientRisk === 'moderate' ? 64 : 81
    const watScores = Array.from({ length: 8 }, (_, i) => {
        const trend = patientRisk === 'high' ? -2.5 : patientRisk === 'moderate' ? 0.8 : 1.2
        return Math.max(20, Math.min(100, baseScore + i * trend + (Math.random() - 0.5) * 8))
    }).map(v => Math.round(v))
    const labels = ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6', 'Wk7', 'Wk8']
    return <Line
        data={{
            labels, datasets: [{
                label: 'WAT Alliance Score',
                data: watScores,
                borderColor: patientRisk === 'high' ? '#f43f5e' : patientRisk === 'moderate' ? '#f59e0b' : '#10b981',
                backgroundColor: patientRisk === 'high' ? 'rgba(244,63,94,0.08)' : patientRisk === 'moderate' ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
                fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#fff'
            }]
        }}
        options={{
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,14,26,0.9)', titleColor: '#c8d3f5', bodyColor: '#8892b0' } },
            scales: {
                y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892b0' } },
                x: { grid: { display: false }, ticks: { color: '#8892b0' } }
            }
        }}
    />
}


export default function Clinician() {
    const [selected, setSelected] = useState(PATIENTS[0])
    const [search, setSearch] = useState('')
    const [soapDraft, setSoapDraft] = useState(false)
    const rc = riskConfig(selected.risk)
    const alertCount = PATIENTS.filter(p => p.risk === 'high').length
    const filtered = PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="clinician-page">
            {/* ── TOP HEADER ───────────────────────────────────── */}
            <div className="clinician-header">
                <div>
                    <h1 className="clinician-title">Clinician Dashboard</h1>
                    <p className="clinician-sub">AI-powered patient retention monitoring · Active patients: {PATIENTS.length}</p>
                </div>
                <div className="clinician-header-right">
                    <div className="alert-chip"><AlertTriangle size={15} color="var(--rose)" /> {alertCount} High-Risk Alerts</div>
                    <div className="clinician-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            {/* ── SUMMARY STATS ────────────────────────────────── */}
            <div className="summary-row">
                {[
                    { icon: <Users size={18} />, label: 'Total Patients', value: PATIENTS.length, color: 'var(--primary-light)' },
                    { icon: <AlertTriangle size={18} />, label: 'High Risk', value: PATIENTS.filter(p => p.risk === 'high').length, color: 'var(--rose)' },
                    { icon: <Bell size={18} />, label: 'Missed Sessions', value: PATIENTS.filter(p => p.nextSession === 'Missed' || p.nextSession === 'Overdue').length, color: 'var(--amber)' },
                    { icon: <CheckCircle size={18} />, label: 'Low Risk', value: PATIENTS.filter(p => p.risk === 'low').length, color: 'var(--green)' },
                    { icon: <TrendingDown size={18} />, label: 'Avg. Risk Score', value: Math.round(PATIENTS.reduce((a, p) => a + p.riskScore, 0) / PATIENTS.length) + '%', color: 'var(--cyan)' },
                ].map(s => (
                    <div key={s.label} className="summary-stat">
                        <div style={{ color: s.color }}>{s.icon}</div>
                        <div><div className="sum-value" style={{ color: s.color }}>{s.value}</div><div className="sum-label">{s.label}</div></div>
                    </div>
                ))}
            </div>

            <div className="clinician-layout">
                {/* ── PATIENT LIST ───────────────────────────────── */}
                <div className="patient-list-panel">
                    <div className="patient-list-header">
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>Patients</span>
                        <div className="search-box">
                            <Search size={14} color="var(--text-400)" />
                            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    {filtered.map(p => {
                        const rc2 = riskConfig(p.risk)
                        const isSelected = p.id === selected.id
                        return (
                            <div key={p.id} className={`patient-list-item ${isSelected ? 'active' : ''}`} onClick={() => setSelected(p)}>
                                <div className={`patient-list-avatar ${p.risk}`}>{p.initials}</div>
                                <div className="patient-list-info">
                                    <div className="patient-list-name">{p.name}</div>
                                    <div className="patient-list-sub">{p.diagnosis} · {p.lastActive}</div>
                                </div>
                                <div className="patient-list-risk-badge">
                                    <span className="dot" style={{ background: rc2.color, boxShadow: `0 0 6px ${rc2.color}` }} />
                                    <span style={{ fontSize: '0.7rem', color: rc2.color, fontWeight: 600 }}>{p.riskScore}%</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ── PATIENT DETAIL ─────────────────────────────── */}
                <div className="patient-detail-panel">
                    {/* Profile row */}
                    <div className="patient-detail-header">
                        <div className={`detail-avatar ${selected.risk}`}>{selected.initials}</div>
                        <div className="detail-info">
                            <h2 className="detail-name">{selected.name}</h2>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
                                <span className="badge badge-primary">{selected.diagnosis}</span>
                                <span className={`badge ${riskConfig(selected.risk).badge}`}><span className="dot" style={{ background: riskConfig(selected.risk).color, boxShadow: `0 0 5px ${riskConfig(selected.risk).color}` }} />{riskConfig(selected.risk).label}</span>
                                <span className="badge badge-cyan">Sessions: {selected.sessions}</span>
                                <span className="badge badge-purple">Therapist: {selected.therapist}</span>
                            </div>
                        </div>
                        <div className="detail-next-session">
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-400)', marginBottom: '0.25rem' }}>NEXT SESSION</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: selected.nextSession === 'Missed' || selected.nextSession === 'Overdue' ? 'var(--rose)' : 'var(--primary-light)' }}>{selected.nextSession}</div>
                        </div>
                    </div>

                    {/* SHAP Risk bar */}
                    <div className="risk-bar-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>SHAP Dropout Risk Score</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: rc.color }}>{selected.riskScore}%</div>
                        </div>
                        <div className="progress-bar-container" style={{ height: 12 }}>
                            <div className={`progress-bar-fill ${selected.risk === 'high' ? 'fill-rose' : selected.risk === 'moderate' ? 'fill-amber' : 'fill-green'}`} style={{ width: `${selected.riskScore}%` }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-400)', margin: '0.5rem 0 0.375rem' }}>SHAP Feature Attribution (Top Drivers):</div>
                        <div className="xai-chips">
                            {selected.risk === 'high' && <><span className="xai-chip xai-red">📉 SHAP: Mood slope ↑</span><span className="xai-chip xai-red">📵 SHAP: Inactivity 3d</span><span className="xai-chip xai-red">❌ SHAP: Missed session</span></>}
                            {selected.risk === 'moderate' && <><span className="xai-chip xai-amber">📊 SHAP: Mood volatility</span><span className="xai-chip xai-amber">⏱ SHAP: Response latency</span></>}
                            {selected.risk === 'low' && <><span className="xai-chip xai-green">✅ SHAP: Daily check-ins</span><span className="xai-chip xai-green">📈 SHAP: Mood trending up</span></>}
                        </div>
                    </div>

                    {/* Charts grid */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-card-title">Weekly Engagement (%)</div>
                            <EngagementChart data={selected.engagement} />
                        </div>
                        <div className="chart-card">
                            <div className="chart-card-title">Mood Trend (1–10)</div>
                            <MoodTrendChart data={selected.mood} />
                        </div>
                    </div>

                    {/* Heatmap + AI insights */}
                    <div className="bottom-row">
                        <div className="chart-card">
                            <div className="chart-card-title">28-Day Mood Heatmap</div>
                            <div className="heatmap-legend">
                                <div className="heatmap-legend-item"><span style={{ background: '#10b981' }} /> Good (8–10)</div>
                                <div className="heatmap-legend-item"><span style={{ background: '#22d3ee' }} /> OK (6–7)</div>
                                <div className="heatmap-legend-item"><span style={{ background: '#f59e0b' }} /> Low (4–5)</div>
                                <div className="heatmap-legend-item"><span style={{ background: '#f43f5e' }} /> Poor (1–3)</div>
                            </div>
                            <MoodHeatmap data={[...selected.mood, ...selected.mood, ...selected.mood, ...selected.mood.slice(0, 7)]} />
                        </div>
                        <div className="chart-card">
                            <div className="chart-card-title">🤝 WAT Alliance Trajectory <span className="badge badge-cyan" style={{ fontSize: '0.62rem', marginLeft: '0.35rem' }}>Working Alliance Transformer</span></div>
                            <WATChart patientRisk={selected.risk} />
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-400)', marginTop: '0.625rem', lineHeight: 1.5 }}>
                                {selected.risk === 'high' ? '⚠️ Alliance degrading — rupture detected. Address in next session.' : selected.risk === 'moderate' ? '⚡ Alliance stable but monitor. Consider rupture repair strategies.' : '✅ Strong collaborative bond. WAI correlation r > 0.70.'}
                            </div>
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="chart-card" style={{ marginTop: '1.25rem' }}>
                        <div className="chart-card-title">🧠 AI Clinical Insights + CareOps SOAP Draft</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                {selected.risk === 'high' && (
                                    <div className="ai-insight-block high">
                                        <strong>⚠️ Urgent: High Dropout Risk</strong>
                                        <p>{selected.name} shows declining mood, extended inactivity, and a missed session. LSTM ensemble: AUC 0.89. Immediate outreach recommended within 24 hours.</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                            <button className="btn btn-sm" style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--rose)' }}>📞 Schedule Call</button>
                                            <button className="btn btn-sm btn-ghost">📧 Send Nudge</button>
                                        </div>
                                    </div>
                                )}
                                {selected.risk === 'moderate' && (
                                    <div className="ai-insight-block moderate">
                                        <strong>⚡ Monitor Closely</strong>
                                        <p>{selected.name} shows mood volatility and increased response latency. Proactive check-in recommended before next session. Random Forest confidence: 74%.</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                            <button className="btn btn-sm btn-secondary">📲 Send Motivational Nudge</button>
                                        </div>
                                    </div>
                                )}
                                {selected.risk === 'low' && (
                                    <div className="ai-insight-block low">
                                        <strong>✅ Progressing Well</strong>
                                        <p>{selected.name} shows excellent adherence, consistent check-ins, and improving mood. Maintenance interventions sufficient. XGBoost confidence: 91%.</p>
                                    </div>
                                )}
                                <div className="ai-session-notes">
                                    <div className="chart-card-title" style={{ marginTop: '0.875rem' }}>📋 Session Prep</div>
                                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-300)', lineHeight: 1.7 }}>
                                        <li>Avg. mood: <strong style={{ color: 'var(--text-100)' }}>{(selected.mood.reduce((a, b) => a + b, 0) / selected.mood.length).toFixed(1)}/10</strong></li>
                                        <li>AI topics: <strong style={{ color: 'var(--text-100)' }}>{selected.risk === 'high' ? 'Motivation, isolation' : 'Stress, sleep quality'}</strong></li>
                                        <li>Last active: {selected.lastActive}</li>
                                    </ul>
                                </div>
                            </div>
                            {/* CareOps SOAP auto-draft — Report: CareOps Automation */}
                            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--cyan)' }}>AI-Drafted SOAP Note <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>CareOps</span></div>
                                {soapDraft ? (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-300)', lineHeight: 1.7 }}>
                                        <strong style={{ color: 'var(--text-100)' }}>S:</strong> Patient reports {selected.risk === 'high' ? 'significant withdrawal and low motivation. Expressed hopelessness regarding progress.' : selected.risk === 'moderate' ? 'moderate anxiety and disrupted sleep. Some positive engagement reported.' : 'improved mood and consistent engagement. Positive progress noted.'}<br />
                                        <strong style={{ color: 'var(--text-100)' }}>O:</strong> PHQ-9 estimated {selected.riskScore > 60 ? '≥14 (moderate-severe)' : selected.riskScore > 30 ? '8-13 (mild-moderate)' : '<7 (minimal)'}. Engagement {(selected.engagement.reduce((a, b) => a + b, 0) / 7).toFixed(0)}% avg. WAT score {selected.risk === 'high' ? '48/100' : selected.risk === 'moderate' ? '64/100' : '81/100'}.<br />
                                        <strong style={{ color: 'var(--text-100)' }}>A:</strong> {selected.diagnosis}. Dropout risk: {selected.risk} ({selected.riskScore}%). Alliance {selected.risk === 'high' ? 'rupture' : 'stable'}.<br />
                                        <strong style={{ color: 'var(--text-100)' }}>P:</strong> {selected.risk === 'high' ? 'Increase session frequency. Crisis protocol review.' : 'Continue CBT protocol. Behavioral activation homework.'}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', lineHeight: 1.7 }}>
                                        Auto-generate a SOAP note from inter-session chatbot data &amp; voice biomarkers.
                                    </div>
                                )}
                                <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setSoapDraft(!soapDraft)}>
                                    {soapDraft ? 'Hide Draft' : '✨ Generate SOAP Draft'}
                                </button>
                                {soapDraft && <div style={{ fontSize: '0.7rem', color: 'var(--text-400)', marginTop: '0.4rem' }}>⚠️ Requires clinician review before use.</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Risk Donut ────────────────────────────── */}
                <div className="clinician-right-panel">
                    <div className="chart-card">
                        <div className="chart-card-title">Risk Distribution</div>
                        <RiskDonut />
                    </div>
                    <div className="alerts-list-card">
                        <div className="chart-card-title">🔔 Active Alerts</div>
                        {PATIENTS.filter(p => p.risk !== 'low').sort((a, b) => b.riskScore - a.riskScore).map(p => {
                            const rc2 = riskConfig(p.risk)
                            return (
                                <div key={p.id} className="alert-item" onClick={() => setSelected(p)}>
                                    <div className="dot" style={{ background: rc2.color, boxShadow: `0 0 5px ${rc2.color}`, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-100)' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-400)' }}>{rc2.label} · {p.riskScore}%</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
