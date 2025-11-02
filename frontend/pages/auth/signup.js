import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { signup as signupService } from '../../services/auth'
import { validateSignup } from '../../utils/validation'

export default function Signup() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        // client-side validation (field-level)
        const { isValid, errors } = validateSignup({ name, email, password })
        if (!isValid) {
            setLoading(false)
            setFieldErrors(errors)
            return
        }
        setFieldErrors({})

        try {
            const res = await signupService({ name, email, password })
            setLoading(false)

            // If backend returned a token in header or body, persist it to localStorage only
            let token = res && res.token ? res.token : null
            if (!token && res && res.data) {
                // check common fields in response body
                token = res.data.token || res.data.accessToken || res.data.Token || res.data.jwt || null
            }

            if (token) {
                const safeToken = String(token).replace(/^Bearer\s+/i, '')
                try {
                    localStorage.setItem('token', safeToken)
                } catch (e) {
                    // ignore localStorage errors (e.g., privacy mode)
                }
            }

            // Navigate to home after signup/login
            router.push('/')
        } catch (err) {
            setLoading(false)
            // Network/API error; prefer server message
            setError(err && err.message ? err.message : 'Signup failed')
            // If backend returned field-level validation in response, surface it
            if (err && err.response && typeof err.response === 'object') {
                const resp = err.response
                const nextFieldErrors = {}
                if (resp.errors && typeof resp.errors === 'object') {
                    Object.assign(nextFieldErrors, resp.errors)
                }
                // Some backends use e.g. { field: "message" } or { message: "..." }
                // We only surface structured errors when present.
                if (Object.keys(nextFieldErrors).length) setFieldErrors(nextFieldErrors)
            }
        }
    }

    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Create Account</h1>
                </div>

                <div className="form">
                    <form onSubmit={handleSubmit}>
                        {/* Row 1: Display name */}
                        <div className="row" style={{ marginBottom: 12 }}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                                {fieldErrors.name && (
                                    <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.name}</div>
                                )}
                        </div>

                        {/* Row 2: Email */}
                        <div className="row" style={{ marginBottom: 12 }}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {fieldErrors.email && (
                                <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.email}</div>
                            )}
                        </div>

                        {/* Row 3: Password with show/hide */}
                        <div className="row" style={{ marginBottom: 12, position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px 40px 8px 8px', boxSizing: 'border-box' }}
                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                aria-pressed={showPassword}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                // Inline styles override the global .form button rule so this toggle
                                                // won't become full-width and won't cover the input.
                                                style={{
                                                    position: 'absolute',
                                                    right: 6,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    padding: '6px 8px',
                                                    background: '#ffffff',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: 4,
                                                    cursor: 'pointer',
                                                    width: 'auto',
                                                    zIndex: 3,
                                                    color: '#111827'
                                                }}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                {fieldErrors.password && (
                                    <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.password}</div>
                                )}
                        </div>

                        <div style={{ marginTop: 8 }}>
                            <button type="submit" style={{ padding: '10px 14px' }} disabled={loading}>
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </div>
                        {error && (
                            <div style={{ marginTop: 8, color: 'red' }} role="alert">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="card_terms" style={{ marginTop: 12 }}>
                    <span>
                        Already have an account?{' '}
                        <Link href="/auth/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}


