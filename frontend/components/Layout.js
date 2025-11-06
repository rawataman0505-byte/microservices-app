import Link from 'next/link'

export default function Layout({ children }) {
	return (
		<>
			{/* <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
				<nav>
					<Link href="/home" style={{ marginRight: 12 }}>
						Home
					</Link>
					<Link href="/about">About</Link>
					<span style={{ marginLeft: 12 }}>
						<Link href="/auth/login" style={{ marginRight: 8 }}>Login</Link>
						<Link href="/auth/signup">Signup</Link>
					</span>
				</nav>
			</header> */}
			<div className="home-page" >{children}</div>
			{/* <footer style={{ padding: '1rem', borderTop: '1px solid #eee', marginTop: '2rem' }}>
				© {new Date().getFullYear()} My App
			</footer> */}
		</>
	)
}

