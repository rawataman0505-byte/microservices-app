import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { login as loginService } from '../../services/auth'
import { validateLogin } from '../../utils/validation'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('admin@gmail.com')
    const [password, setPassword] = useState('Admin@123')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // client-side validation (field-level)
        const { isValid, errors } = validateLogin({ email, password })
        if (!isValid) {
            setLoading(false)
            setFieldErrors(errors)
            return
        }
        setFieldErrors({})

        try {
            const res = await loginService({ email, password })
            setLoading(false)

            const token = res && res.token ? res.token : null
            let finalToken = token
            if (!finalToken && res && res.data) {
                finalToken = res.data.token || res.data.accessToken || res.data.Token || res.data.jwt || null
            }
            if (finalToken) {
                const safeToken = String(finalToken).replace(/^Bearer\s+/i, '')
                try { localStorage.setItem('token', safeToken) } catch (e) {}
            }

            // redirect to home page using Next router to avoid full reload
            router.push('/home')
        } catch (err) {
            setLoading(false)
            setError(err && err.message ? err.message : 'Login failed')
            if (err && err.response && typeof err.response === 'object') {
                const resp = err.response
                const nextFieldErrors = {}
                if (resp.errors && typeof resp.errors === 'object') Object.assign(nextFieldErrors, resp.errors)
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
                    <h1>Login Here</h1>
                </div>

                <div className="form">
                    <form onSubmit={handleSubmit}>
                        {/* Email row */}
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

                        {/* Password row with toggle */}
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
                            <button type="submit" style={{ padding: '8px 12px' }} disabled={loading}>
                                {/* {loading ? 'Signing in...' : 'Login'} */}Login
                            </button>
                        </div>
                        {error && <div style={{ marginTop: 8, color: 'red' }}>{error}</div>}
                    </form>
                </div>

                <div className="card_terms">
                    <span>
                        Don't have an account yet? <Link href="/auth/signup">Signup Here</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}