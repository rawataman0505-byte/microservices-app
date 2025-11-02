import Head from 'next/head'
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
import { fetchProfile } from '../../services/profile'
import ProfileCard from '../../components/ProfileCard'
import Link from 'next/link'

export default function Home() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [user, setUser] = useState(null)

	async function loadProfile() {
		setLoading(true)
		setError(null)
		try {
			
			const res = await fetchProfile()
			// res.data expected to contain { user: { ... } }
			const maybeUser = res && res.data && res.data.data.user ? res.data.data.user : null
			setUser(maybeUser)
		} catch (err) {
			setUser(null)
			// prefer APIError message if present
			setError(err && err.message ? err.message : 'Failed to load profile')
			// if unauthorized, token might be invalid/expired
			if (err && err.status === 401) {
				try { localStorage.removeItem('token') } catch (e) {}
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadProfile()
	}, [])

	return (
		<Layout>
			<Head>
				<title>Home — Profile</title>
			</Head>

			<main style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
				<h1>Profile</h1>

				{loading && <div>Loading profile...</div>}

				{!loading && error && (
					<div style={{ color: 'red' }}>
						<p>{error}</p>
						<div style={{ marginTop: 8 }}>
							<Link href="/auth/login">
								Go to Login
							</Link>
							<button onClick={loadProfile} style={{ padding: '6px 10px' }}>
								Retry
							</button>
						</div>
					</div>
				)}

				{!loading && !error && !user && (
					<div>
						<p>You are not signed in.</p>
						<Link href="/auth/login">Login</Link>
					</div>
				)}

				{!loading && user && (
					<div style={{ marginTop: 12 }}>
						<ProfileCard user={user} />
					</div>
				)}
			</main>
		</Layout>
	)
}
