import { useState, useRef, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Send, AlertTriangle, Heart, Zap, Calendar, TrendingUp, Mic, MicOff, Globe, Activity } from 'lucide-react'
import './Patient.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

/* ── Chatbot Data ─────────────────────────────────────────── */
const CONVERSATIONS = {
    start: {
        message: "Hi! I'm your NeuroBridge companion. I'm here to support you between therapy sessions. How are you feeling today? 😊",
        options: [
            { text: "😊 Pretty good, actually!", next: 'good' },
            { text: "😐 Okay, nothing special", next: 'neutral' },
            { text: "😞 Not great today", next: 'low' },
            { text: "😰 I'm really struggling", next: 'crisis_check' },
        ]
    },
    good: {
        message: "That's wonderful to hear! 🌟 Positive days are worth celebrating. What's been contributing to that good feeling?",
        options: [
            { text: "I got some exercise in", next: 'exercise' },
            { text: "Connected with a friend", next: 'social' },
            { text: "Just feeling balanced", next: 'balanced' },
        ]
    },
    neutral: {
        message: "Neutral days are completely normal — they're actually a stable baseline! Would you like to try a brief mood-boosting activity?",
        options: [
            { text: "Sure, what do you suggest?", next: 'activity' },
            { text: "I'd rather just check in", next: 'checkin' },
        ]
    },
    low: {
        message: "I'm sorry you're having a tough day. It takes courage to say that. 💙 Can you tell me a bit more about what's weighing on you?",
        options: [
            { text: "Anxious thoughts I can't stop", next: 'anxiety' },
            { text: "Low energy and unmotivated", next: 'activation' },
            { text: "Sad without knowing why", next: 'sadness' },
        ]
    },
    crisis_check: {
        message: "I hear that you're really struggling, and I want you to know that support is available right now. Are you having any thoughts of harming yourself?",
        options: [
            { text: "No, just feeling very overwhelmed", next: 'overwhelmed' },
            { text: "I need immediate help", next: 'crisis' },
        ],
        isCrisisCheck: true
    },
    crisis: {
        message: "🚨 Your safety is the priority. Please reach out right now:\n\n• **iCall: 9152987821**\n• **Vandrevala Foundation: 1860-2662-345** (24/7)\n• **Text HOME to 741741**\n\nYour therapist has been notified. You are not alone. 💙",
        options: [{ text: "I'll reach out. Thank you.", next: 'start' }],
        isCrisis: true
    },
    exercise: {
        message: "Physical movement is one of the most powerful mood regulators we have! Endorphins do real work. 💪 Have you been maintaining this routine recently?",
        options: [{ text: "Yes, it's a regular habit", next: 'cbt_thought' }, { text: "It was a one-off today", next: 'activation' }]
    },
    social: {
        message: "Social connection is protective for mental health — research-backed! 🌺 Human bonds reduce cortisol and strengthen resilience. Keep nurturing those connections.",
        options: [{ text: "That's reassuring!", next: 'cbt_thought' }]
    },
    balanced: {
        message: "Balance is the goal — not constant highs. This present-moment stability is a real achievement. Let's do a quick CBT check: what thought are you holding right now?",
        options: [{ text: "Let's do the check", next: 'cbt_thought' }]
    },
    activity: {
        message: "Let's try behavioral activation! 🎯 Think of one small, enjoyable activity you can do in the next 30 minutes — even something tiny like making tea, stepping outside, or listening to one song.",
        options: [{ text: "I can try a short walk", next: 'great_choice' }, { text: "Maybe some music", next: 'great_choice' }]
    },
    great_choice: {
        message: "Perfect! That small action creates momentum. Behavioral activation works by building positive experience into your day. 🌱 I'll check back with you tomorrow. Remember — tiny steps count.",
        options: [{ text: "Thanks, I'll try it!", next: 'start' }]
    },
    anxiety: {
        message: "Anxiety creates a thought loop that feels impossible to exit. Let's break it with a grounding exercise — the 5-4-3-2-1 technique. Name **5 things you can see** around you right now.",
        options: [{ text: "I can see... (5 things listed)", next: 'grounding_2' }]
    },
    grounding_2: {
        message: "Great. Now 4 things you can **touch**. Feel their texture — rough, smooth, warm, cool. Notice the sensations without judgment.",
        options: [{ text: "Done ✓", next: 'grounding_3' }]
    },
    grounding_3: {
        message: "3 things you can **hear**, 2 you can **smell**, 1 you can **taste**. This grounds you in the present moment, away from the anxiety loop. How do you feel now?",
        options: [{ text: "A little calmer, thank you", next: 'checkin' }, { text: "Still anxious", next: 'crisis_check' }]
    },
    activation: {
        message: "Low energy and motivation — classic depression symptoms. Your brain isn't broken, it's in conservation mode. 💙 The antidote is tiny action. What's one thing — even washing your face — you could do right now?",
        options: [{ text: "I can probably manage that", next: 'great_choice' }]
    },
    sadness: {
        message: "Sadness without a clear 'why' can feel disorienting. What you're feeling is valid — depression isn't always logical. 💙 Let's reframe: can you name **one thing** that hasn't been terrible about today?",
        options: [{ text: "I had a decent meal", next: 'cbt_thought' }, { text: "I made it through the day", next: 'cbt_thought' }]
    },
    overwhelmed: {
        message: "Feeling overwhelmed is exhausting. Let's slow this down. Take one deep breath with me — inhale for 4, hold for 4, exhale for 6. Then we'll break what you're facing into small pieces.",
        options: [{ text: "Done. That helped a bit.", next: 'cbt_thought' }]
    },
    cbt_thought: {
        message: "Let's do a quick CBT thought record. What's a negative automatic thought you've had recently? (e.g., 'I always fail', 'No one cares')",
        options: [
            { text: "I'm not making any progress", next: 'cbt_challenge' },
            { text: "Everyone else is doing better", next: 'cbt_challenge' },
        ]
    },
    cbt_challenge: {
        message: "That thought is a cognitive distortion — very common in depression. Let's challenge it: **What evidence exists AGAINST this thought?** Often, small wins get filtered out. What's one thing you've done recently that was hard?",
        options: [{ text: "I came to therapy / talked to you today", next: 'cbt_reframe' }]
    },
    cbt_reframe: {
        message: "That counts! Seeking support is a significant act. A balanced thought might be: 'Progress isn't always visible, but I'm still showing up.' How does that feel? 🌱",
        options: [{ text: "Better. Thank you.", next: 'checkin' }]
    },
    checkin: {
        message: "Before we wrap up — your session with Dr. Mehta is in 3 days. I'll set a reminder. Is there anything specific you want to discuss with them that came up today?",
        options: [
            { text: "The anxiety we talked about", next: 'end' },
            { text: "My energy levels", next: 'end' },
            { text: "Nothing specific right now", next: 'end' },
        ]
    },
    end: {
        message: "I've noted that for your session. 📋 You've done something meaningful today by checking in. I'll be here tomorrow. Remember: one day at a time. 💙",
        options: [{ text: "Start over", next: 'start' }]
    }
}

const MOOD_DATA_INIT = [5, 6, 4, 7, 6, 7, null]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']

function MoodChart({ moodData }) {
    const chartData = {
        labels: DAYS,
        datasets: [{
            label: 'Mood Score',
            data: moodData,
            fill: true,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.12)',
            pointBackgroundColor: moodData.map(v => v === null ? 'transparent' : v >= 7 ? '#10b981' : v >= 5 ? '#f59e0b' : '#f43f5e'),
            pointBorderColor: '#fff',
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.4,
            spanGaps: false,
        }]
    }
    const options = {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,22,40,0.9)', titleColor: '#c8d3f5', bodyColor: '#8892b0', borderColor: 'rgba(99,102,241,0.3)', borderWidth: 1 } },
        scales: {
            y: { min: 1, max: 10, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8892b0', stepSize: 1 } },
            x: { grid: { display: false }, ticks: { color: '#8892b0' } }
        }
    }
    return <Line data={chartData} options={options} />
}

function RiskGauge({ risk }) {
    const r = 54, cx = 70, cy = 70
    const circumference = Math.PI * r
    const offset = circumference - (risk / 100) * circumference
    const color = risk < 30 ? '#10b981' : risk < 60 ? '#f59e0b' : '#f43f5e'
    const label = risk < 30 ? 'Low Risk' : risk < 60 ? 'Moderate' : 'High Risk'
    return (
        <div className="risk-gauge-container">
            <svg width="140" height="85" viewBox="0 0 140 85">
                <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color}
                    strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }} />
                <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="18" fontWeight="800" fontFamily="Outfit,sans-serif">{risk}%</text>
                <text x={cx} y={cy + 8} textAnchor="middle" fill="#8892b0" fontSize="10">{label}</text>
            </svg>
            <p className="risk-gauge-sub">Dropout Risk Score</p>
        </div>
    )
}

/* ── Voice Biomarker Check-In ─────────────────────────────── */
const VOICE_STAGES = ['ready', 'recording', 'analyzing', 'done']
const VOICE_FEATURES = [
    { label: 'Pitch Variability', low: 35, high: 78, desc: 'Low monotony → positive affect' },
    { label: 'Speech Rate', low: 42, high: 88, desc: 'Within healthy range' },
    { label: 'Vocal Energy', low: 61, high: 91, desc: 'Strong engagement signal' },
    { label: 'Pause Frequency', low: 55, high: 70, desc: 'Mild cognitive load detected' },
]

function VoiceBiomarkerCard({ onRiskUpdate }) {
    const [stage, setStage] = useState('ready')
    const [progress, setProgress] = useState(0)
    const [results, setResults] = useState(null)
    const intervalRef = useRef(null)

    const startRecording = () => {
        setStage('recording')
        setProgress(0)
        let p = 0
        intervalRef.current = setInterval(() => {
            p += 100 / 20  // 20s recording simulated in 3s
            setProgress(Math.min(p, 100))
            if (p >= 100) {
                clearInterval(intervalRef.current)
                setStage('analyzing')
                setTimeout(() => {
                    const score = Math.floor(Math.random() * 30) + 45
                    setResults({
                        score,
                        severity: score < 50 ? 'Minimal' : score < 65 ? 'Mild' : 'Moderate',
                        color: score < 50 ? 'var(--green)' : score < 65 ? 'var(--amber)' : 'var(--rose)',
                        features: VOICE_FEATURES.map(f => ({ ...f, value: Math.floor(Math.random() * (f.high - f.low)) + f.low }))
                    })
                    setStage('done')
                    onRiskUpdate(score)
                }, 1500)
            }
        }, 150)
    }

    const reset = () => { setStage('ready'); setResults(null); setProgress(0) }

    return (
        <div className="voice-card right-panel-card">
            <div className="right-panel-card-title">🎙️ Vocal Biomarker Check-In</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                20-sec voice sample analyzed for pitch variability, speech rate &amp; acoustic markers of affect.
            </div>

            {stage === 'ready' && (
                <button className="btn btn-secondary w-full" style={{ justifyContent: 'center', gap: '0.5rem' }} onClick={startRecording}>
                    <Mic size={16} color="var(--cyan)" /> Start Voice Check-In
                </button>
            )}

            {stage === 'recording' && (
                <div className="voice-recording-ui">
                    <div className="voice-mic-pulse"><MicOff size={22} color="var(--rose)" /></div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--rose)', fontWeight: 600 }}>Recording... {Math.round(progress)}%</div>
                    <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                        <div className="progress-bar-fill fill-rose" style={{ width: `${progress}%` }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-400)', marginTop: '0.4rem' }}>Capturing paralinguistic features</div>
                </div>
            )}

            {stage === 'analyzing' && (
                <div className="voice-analyzing">
                    <Activity size={22} color="var(--cyan)" style={{ animation: 'pulse-dot 1s infinite' }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--cyan)' }}>Applying EMD + Gaussian kernel analysis...</span>
                </div>
            )}

            {stage === 'done' && results && (
                <div className="voice-results">
                    <div className="voice-result-score" style={{ color: results.color }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>{results.score}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-400)', marginLeft: '0.3rem' }}>/100</span>
                        <span className="badge" style={{ marginLeft: '0.5rem', background: results.color + '22', color: results.color, border: `1px solid ${results.color}44` }}>{results.severity}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-400)', marginBottom: '0.625rem' }}>Depression Severity Index (Voice)</div>
                    {results.features.map(f => (
                        <div key={f.label} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                                <span style={{ color: 'var(--text-300)' }}>{f.label}</span>
                                <span style={{ color: 'var(--text-100)', fontWeight: 600 }}>{f.value}%</span>
                            </div>
                            <div className="progress-bar-container" style={{ height: 5 }}>
                                <div className="progress-bar-fill fill-primary" style={{ width: `${f.value}%` }} />
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-ghost btn-sm w-full" style={{ marginTop: '0.5rem', justifyContent: 'center' }} onClick={reset}>Redo Check-In</button>
                </div>
            )}
        </div>
    )
}

/* ── Patient-in-the-Loop Panel ────────────────────────────── */
const PITL_FLAGS = [
    { day: 'Tue', flag: 'Inactivity spike', auto: 'Depressive relapse risk ↑', icon: '⚠️' },
    { day: 'Wed', flag: 'Disrupted sleep pattern', auto: 'Circadian disruption', icon: '😴' },
    { day: 'Thu', flag: 'Low social contact', auto: 'Withdrawal signal', icon: '📵' },
]
function PatientInTheLoopPanel() {
    const [annotations, setAnnotations] = useState({ Tue: '', Wed: '', Thu: '' })
    const [saved, setSaved] = useState({})
    const save = (day) => {
        setSaved(s => ({ ...s, [day]: annotations[day] }))
    }
    return (
        <div className="right-panel-card">
            <div className="right-panel-card-title">🔍 Your Behavioral Data <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Patient-in-the-Loop</span></div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                AI flagged these anomalies this week. You can contextualise them to improve your model's accuracy.
            </div>
            {PITL_FLAGS.map(f => (
                <div key={f.day} className="pitl-item">
                    <div className="pitl-header">
                        <span className="pitl-icon">{f.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{f.day}: {f.flag}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-400)' }}>AI inference: {f.auto}</div>
                        </div>
                    </div>
                    {saved[f.day] ? (
                        <div className="pitl-saved">✅ Your note: <em>{saved[f.day]}</em></div>
                    ) : (
                        <div className="pitl-annotate">
                            <input
                                className="pitl-input"
                                placeholder="Add context (e.g. had the flu)..."
                                value={annotations[f.day] || ''}
                                onChange={e => setAnnotations(a => ({ ...a, [f.day]: e.target.value }))}
                            />
                            <button className="btn btn-ghost btn-sm" onClick={() => save(f.day)}>Save</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

/* ── Implementation Intention Card ───────────────────────── */
function ImplementationIntentionCard() {
    const [ifPart, setIfPart] = useState('')
    const [thenPart, setThenPart] = useState('')
    const [saved, setSaved] = useState(null)
    const examples = [
        { if: 'I feel overwhelmed before bed', then: 'I will open the PMR module and do 5 minutes' },
        { if: 'I start to ruminate at work', then: 'I will take a 3-minute walk outside' },
    ]
    return (
        <div className="right-panel-card">
            <div className="right-panel-card-title">🎯 Implementation Intention <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Behavioural Econ</span></div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Set a concrete "if-then" plan to handle difficult moments before they arise.
            </div>
            {saved ? (
                <div className="intention-saved">
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-200)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--amber)' }}>IF</strong> {saved.if}<br />
                        <strong style={{ color: 'var(--green)' }}>THEN</strong> {saved.then}
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => setSaved(null)}>Edit</button>
                </div>
            ) : (
                <>
                    <div className="intention-field">
                        <label style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>IF (trigger situation)</label>
                        <input className="pitl-input" placeholder="e.g. I feel anxious before work..." value={ifPart} onChange={e => setIfPart(e.target.value)} />
                    </div>
                    <div className="intention-field">
                        <label style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>THEN (coping action)</label>
                        <input className="pitl-input" placeholder="e.g. I will do box breathing for 2 min..." value={thenPart} onChange={e => setThenPart(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => { if (ifPart && thenPart) setSaved({ if: ifPart, then: thenPart }) }}>Save Intention</button>
                        {examples.map((ex, i) => (
                            <button key={i} className="btn btn-ghost btn-sm" onClick={() => { setIfPart(ex.if); setThenPart(ex.then) }}>Example {i + 1}</button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}


export default function Patient() {
    const [messages, setMessages] = useState([{ role: 'ai', text: CONVERSATIONS.start.message, options: CONVERSATIONS.start.options, key: 'start' }])
    const [isTyping, setIsTyping] = useState(false)
    const [moodData, setMoodData] = useState(MOOD_DATA_INIT)
    const [todayMood, setTodayMood] = useState(null)
    const [riskScore, setRiskScore] = useState(42)
    const [streak, setStreak] = useState(12)
    const [crisisVisible, setCrisisVisible] = useState(false)
    const [inputText, setInputText] = useState('')
    const [language, setLanguage] = useState('EN')
    const chatEndRef = useRef(null)
    const chatContainerRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleOption = (option) => {
        const currentNode = CONVERSATIONS[messages[messages.length - 1].key]
        if (currentNode?.isCrisisCheck && option.next === 'crisis') setCrisisVisible(true)
        setMessages(prev => [...prev, { role: 'user', text: option.text }])
        setIsTyping(true)
        const delay = 800 + Math.random() * 800
        setTimeout(() => {
            const nextNode = CONVERSATIONS[option.next]
            if (!nextNode) return
            setIsTyping(false)
            setMessages(prev => [...prev, { role: 'ai', text: nextNode.message, options: nextNode.options, key: option.next, isCrisis: nextNode.isCrisis }])
            if (option.next === 'good' || option.next === 'balanced') setRiskScore(r => Math.max(10, r - 8))
            if (option.next === 'low' || option.next === 'overwhelmed') setRiskScore(r => Math.min(90, r + 10))
        }, delay)
    }

    const handleMoodSubmit = (score) => {
        setTodayMood(score)
        const newData = [...moodData]; newData[6] = score; setMoodData(newData)
        setRiskScore(score >= 7 ? Math.max(10, riskScore - 12) : score <= 4 ? Math.min(90, riskScore + 15) : riskScore)
        setStreak(s => s + 1)
    }

    const handleSendText = () => {
        if (!inputText.trim()) return
        const text = inputText.trim(); setInputText('')
        setMessages(prev => [...prev, { role: 'user', text }])
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            const responses = [
                "Thank you for sharing that. I'm listening. Would you like to explore a coping technique together?",
                "I hear you. Let's slow down and work through this step by step. What feels most urgent right now?",
                "That makes a lot of sense given what you're going through. Remember: your feelings are valid signals, not facts.",
            ]
            setMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)], options: [{ text: "Tell me more", next: 'checkin' }], key: 'checkin' }])
        }, 1200 + Math.random() * 600)
    }

    const moodEmojis = ['😞', '😕', '😐', '🙂', '😁']
    const languages = ['EN', 'HI', 'TA', 'TE', 'BN']

    return (
        <div className="patient-page">
            {crisisVisible && (
                <div className="crisis-banner">
                    <AlertTriangle size={20} /> In crisis? Call <strong>iCall: 9152987821</strong> or text HOME to 741741.
                    <button onClick={() => setCrisisVisible(false)}>✕</button>
                </div>
            )}

            <div className="patient-layout">
                {/* ── LEFT PANEL ─────────────────────────────── */}
                <aside className="patient-sidebar">
                    <div className="patient-profile">
                        <div className="patient-avatar">MR</div>
                        <div>
                            <div className="patient-name">Maya Reddy</div>
                            <div className="patient-since">In therapy since Jan 2025</div>
                        </div>
                    </div>

                    {/* Language selector — multilingual NLP from report */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-label"><Globe size={14} /> Language</div>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                            {languages.map(l => (
                                <button key={l} onClick={() => setLanguage(l)}
                                    className="lang-btn"
                                    style={{ background: language === l ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)', borderColor: language === l ? 'var(--primary)' : 'var(--border)', color: language === l ? 'var(--primary-light)' : 'var(--text-300)' }}>
                                    {l}
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-400)', marginTop: '0.4rem' }}>Cross-Lingual NLP · Code-mixed support</div>
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card-label"><Calendar size={14} /> Next Session</div>
                        <div className="sidebar-card-value" style={{ color: 'var(--primary-light)' }}>Tomorrow, 3:00 PM</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>Dr. Priya Mehta • 50 min</div>
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card-label"><Zap size={14} /> Streak</div>
                        <div className="sidebar-card-value" style={{ color: 'var(--cyan)' }}>{streak} days 🔥</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>Consistent engagement target: 40+ days</div>
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card-label"><Heart size={14} /> Mood Today</div>
                        {todayMood ? (
                            <div className="sidebar-card-value" style={{ color: 'var(--green)' }}>{moodEmojis[todayMood - 1]} {todayMood}/10</div>
                        ) : (
                            <div className="mood-emoji-row">
                                {moodEmojis.map((e, i) => (
                                    <button key={i} className="mood-emoji-btn" onClick={() => handleMoodSubmit(i * 2 + 1)} title={`Mood ${i * 2 + 1}/10`}>{e}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card-label"><TrendingUp size={14} /> Dropout Risk</div>
                        <RiskGauge risk={riskScore} />
                    </div>

                    <div className="crisis-support-card">
                        <div className="crisis-support-title">🚨 Crisis Support</div>
                        <a href="tel:9152987821" className="crisis-link">iCall: 9152987821</a>
                        <a href="tel:18602662345" className="crisis-link">Vandrevala: 1860-2662-345</a>
                        <div className="crisis-link" style={{ cursor: 'default' }}>Text HOME to 741741</div>
                    </div>
                </aside>

                {/* ── CHATBOT ────────────────────────────────── */}
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="chatbot-avatar-header">🧠</div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>NeuroBridge AI <span style={{ fontSize: '0.72rem', color: 'var(--text-400)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>· {language} mode · CL-PDE NLP</span></div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-300)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span className="dot dot-green" style={{ animation: 'pulse-dot 2s infinite' }} /> Online • CBT · Behavioural Activation · Grounding
                                </div>
                            </div>
                        </div>
                        <span className="badge badge-primary">CBT Mode</span>
                    </div>

                    <div className="chatbot-messages" ref={chatContainerRef}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg-wrapper ${msg.role}`}>
                                {msg.role === 'ai' && <div className="chat-avatar-ai">🧠</div>}
                                <div className="chat-msg-block">
                                    {msg.isCrisis && <div className="crisis-msg-banner">🚨 Emergency Resources Activated — Clinician Notified</div>}
                                    <div className={`chat-bubble ${msg.role}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    {msg.role === 'ai' && msg.options && i === messages.length - 1 && (
                                        <div className="chat-options">
                                            {msg.options.map((o, j) => (
                                                <button key={j} className="chat-option-btn" onClick={() => handleOption(o)}>{o.text}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {msg.role === 'user' && <div className="chat-avatar-user">MR</div>}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-msg-wrapper ai">
                                <div className="chat-avatar-ai">🧠</div>
                                <div className="typing-indicator-chat"><span /><span /><span /></div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chatbot-input-row">
                        <input
                            className="chatbot-input"
                            placeholder={`Type a message in ${language}...`}
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendText()}
                        />
                        <button className="btn btn-primary btn-icon" onClick={handleSendText}><Send size={16} /></button>
                    </div>
                </div>

                {/* ── RIGHT PANEL ─────────────────────────────── */}
                <aside className="patient-right-panel">
                    <div className="right-panel-card">
                        <div className="right-panel-card-title">📈 7-Day Mood Trend</div>
                        <MoodChart moodData={moodData} />
                    </div>

                    {/* Voice Biomarker Check-In — from Report Section 2: Vocal Biomarkers */}
                    <VoiceBiomarkerCard onRiskUpdate={(s) => setRiskScore(r => Math.round((r + s) / 2))} />

                    {/* Patient-in-the-Loop — from Report Section: Passive Sensing */}
                    <PatientInTheLoopPanel />

                    {/* Implementation Intentions — from Report: Behavioural Economics */}
                    <ImplementationIntentionCard />

                    <div className="right-panel-card">
                        <div className="right-panel-card-title">💡 Today's Coping Tools</div>
                        <div className="coping-tools-list">
                            {[
                                { icon: '🧘', label: '5-4-3-2-1 Grounding', tag: 'Anxiety · Evidence-based' },
                                { icon: '📝', label: 'CBT Thought Record', tag: 'Cognitive restructuring' },
                                { icon: '🏃', label: '10-min Walk Challenge', tag: 'Behavioural activation' },
                                { icon: '💭', label: 'Worry Postponement', tag: 'Rumination · CBT' },
                            ].map(t => (
                                <div key={t.label} className="coping-tool-item">
                                    <span className="coping-tool-icon">{t.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-200)' }}>{t.label}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-400)' }}>{t.tag}</div>
                                    </div>
                                    <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Try</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}


useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages, isTyping])

const handleOption = (option) => {
    // Check for crisis
    const currentNode = CONVERSATIONS[messages[messages.length - 1].key]
    if (currentNode?.isCrisisCheck && option.next === 'crisis') setCrisisVisible(true)
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: option.text }])
    setIsTyping(true)
    const delay = 800 + Math.random() * 800
    setTimeout(() => {
        const nextNode = CONVERSATIONS[option.next]
        if (!nextNode) return
        setIsTyping(false)
        setMessages(prev => [...prev, { role: 'ai', text: nextNode.message, options: nextNode.options, key: option.next, isCrisis: nextNode.isCrisis }])
        // Update risk score dynamically
        if (option.next === 'good' || option.next === 'balanced') setRiskScore(r => Math.max(10, r - 8))
        if (option.next === 'low' || option.next === 'overwhelmed') setRiskScore(r => Math.min(90, r + 10))
    }, delay)
}

const handleMoodSubmit = (score) => {
    setTodayMood(score)
    const newData = [...moodData]; newData[6] = score; setMoodData(newData)
    setRiskScore(score >= 7 ? Math.max(10, riskScore - 12) : score <= 4 ? Math.min(90, riskScore + 15) : riskScore)
    setStreak(s => s + 1)
}

const handleSendText = () => {
    if (!inputText.trim()) return
    const text = inputText.trim(); setInputText('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setIsTyping(true)
    setTimeout(() => {
        setIsTyping(false)
        const responses = [
            "Thank you for sharing that. I'm listening. Would you like to explore a coping technique together?",
            "I hear you. Let's slow down and work through this step by step. What feels most urgent right now?",
            "That makes a lot of sense given what you're going through. Remember: your feelings are valid signals, not facts.",
        ]
        setMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)], options: [{ text: "Tell me more", next: 'checkin' }], key: 'checkin' }])
    }, 1200 + Math.random() * 600)
}

const moodEmojis = ['😞', '😕', '😐', '🙂', '😁']

return (
    <div className="patient-page">
        {/* Crisis Banner */}
        {crisisVisible && (
            <div className="crisis-banner">
                <AlertTriangle size={20} /> In crisis? Call <strong>iCall: 9152987821</strong> or text HOME to 741741.
                <button onClick={() => setCrisisVisible(false)}>✕</button>
            </div>
        )}

        <div className="patient-layout">
            {/* ── LEFT PANEL ──────────────────────────────────── */}
            <aside className="patient-sidebar">
                <div className="patient-profile">
                    <div className="patient-avatar">MR</div>
                    <div>
                        <div className="patient-name">Maya Reddy</div>
                        <div className="patient-since">In therapy since Jan 2025</div>
                    </div>
                </div>

                <div className="sidebar-card">
                    <div className="sidebar-card-label"><Calendar size={14} /> Next Session</div>
                    <div className="sidebar-card-value" style={{ color: 'var(--primary-light)' }}>Tomorrow, 3:00 PM</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>Dr. Priya Mehta • 50 min</div>
                </div>

                <div className="sidebar-card">
                    <div className="sidebar-card-label"><Zap size={14} /> Streak</div>
                    <div className="sidebar-card-value" style={{ color: 'var(--cyan)' }}>{streak} days 🔥</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>Keep it up!</div>
                </div>

                <div className="sidebar-card">
                    <div className="sidebar-card-label"><Heart size={14} /> Mood Today</div>
                    {todayMood ? (
                        <div className="sidebar-card-value" style={{ color: 'var(--green)' }}>{moodEmojis[todayMood - 1]} {todayMood}/10</div>
                    ) : (
                        <div className="mood-emoji-row">
                            {moodEmojis.map((e, i) => (
                                <button key={i} className="mood-emoji-btn" onClick={() => handleMoodSubmit(i * 2 + 1)} title={`Mood ${i * 2 + 1}/10`}>{e}</button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-card">
                    <div className="sidebar-card-label"><TrendingUp size={14} /> Dropout Risk</div>
                    <RiskGauge risk={riskScore} />
                </div>

                <div className="crisis-support-card">
                    <div className="crisis-support-title">🚨 Crisis Support</div>
                    <a href="tel:9152987821" className="crisis-link">iCall: 9152987821</a>
                    <a href="tel:18602662345" className="crisis-link">Vandrevala: 1860-2662-345</a>
                    <div className="crisis-link" style={{ cursor: 'default' }}>Text HOME to 741741</div>
                </div>
            </aside>

            {/* ── CENTER: CHATBOT ──────────────────────────────── */}
            <div className="chatbot-panel">
                <div className="chatbot-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="chatbot-avatar-header">🧠</div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>NeuroBridge AI</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-300)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span className="dot dot-green" style={{ animation: 'pulse-dot 2s infinite' }} /> Online • Evidence-based support
                            </div>
                        </div>
                    </div>
                    <span className="badge badge-primary">CBT Mode</span>
                </div>

                <div className="chatbot-messages" ref={chatContainerRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-msg-wrapper ${msg.role}`}>
                            {msg.role === 'ai' && <div className="chat-avatar-ai">🧠</div>}
                            <div className="chat-msg-block">
                                {msg.isCrisis && <div className="crisis-msg-banner">🚨 Emergency Resources Activated</div>}
                                <div className={`chat-bubble ${msg.role}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                {msg.role === 'ai' && msg.options && i === messages.length - 1 && (
                                    <div className="chat-options">
                                        {msg.options.map((o, j) => (
                                            <button key={j} className="chat-option-btn" onClick={() => handleOption(o)}>{o.text}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {msg.role === 'user' && <div className="chat-avatar-user">MR</div>}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat-msg-wrapper ai">
                            <div className="chat-avatar-ai">🧠</div>
                            <div className="typing-indicator-chat"><span /><span /><span /></div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="chatbot-input-row">
                    <input
                        className="chatbot-input"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendText()}
                    />
                    <button className="btn btn-primary btn-icon" onClick={handleSendText}><Send size={16} /></button>
                </div>
            </div>

            {/* ── RIGHT PANEL ─────────────────────────────────── */}
            <aside className="patient-right-panel">
                <div className="right-panel-card">
                    <div className="right-panel-card-title">📈 7-Day Mood Trend</div>
                    <MoodChart moodData={moodData} />
                </div>

                <div className="right-panel-card">
                    <div className="right-panel-card-title">💡 Today's Coping Tools</div>
                    <div className="coping-tools-list">
                        {[
                            { icon: '🧘', label: '5-4-3-2-1 Grounding', tag: 'Anxiety' },
                            { icon: '📝', label: 'CBT Thought Record', tag: 'Depression' },
                            { icon: '🏃', label: '10-min Walk Challenge', tag: 'Activation' },
                            { icon: '💭', label: 'Worry Postponement', tag: 'Rumination' },
                        ].map(t => (
                            <div key={t.label} className="coping-tool-item">
                                <span className="coping-tool-icon">{t.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-200)' }}>{t.label}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-400)' }}>{t.tag}</div>
                                </div>
                                <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Try</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-panel-card">
                    <div className="right-panel-card-title">📋 Session Prep</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-300)', lineHeight: 1.7 }}>
                        Based on your week, consider discussing:<br />
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <li>Anxiety patterns before work</li>
                            <li>Fatigue and motivation levels</li>
                            <li>Social connection quality</li>
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    </div>
)
}
