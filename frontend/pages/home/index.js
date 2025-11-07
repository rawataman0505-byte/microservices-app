import Head from 'next/head'
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
import { fetchProfile, fetchAllusers } from '../../services/profile'
import { fetchAllChats } from '../../services/chat'
import ProfileCard from '../../components/ProfileCard'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { useAppDispatch } from '../../redux/hooks'
import { setAllUsers, setAllChats, setUser as setUserAction } from '../../redux/slice/userSlice'
import Link from 'next/link'
import ChatArea from '../../components/chatArea'

export default function Home() {
	
	const [error, setError] = useState(null)
	const [user, setUser] = useState(null)
	const dispatch = useAppDispatch()

	async function loadProfile() {
		setError(null)
		try {
			
			const res = await fetchProfile()
			// res.data expected to contain { user: { ... } }
			const maybeUser = res && res.data && res.data.data.user ? res.data.data.user : null
			// set local state for immediate render
			setUser(maybeUser)
			// also store user in redux so other parts of the app can access it
			if (maybeUser) dispatch(setUserAction(maybeUser))
		} catch (err) {
			setUser(null)
			// prefer APIError message if present
			setError(err && err.message ? err.message : 'Failed to load profile')
			// if unauthorized, token might be invalid/expired
			if (err && err.status === 401) {
				try { localStorage.removeItem('token') } catch (e) {}
			}
		} 
	}
	async function getAlluser() {
		setError(null)
		try {
			
			const res = await fetchAllusers()
			// console.log(res.data,"res from all users")
			// Try to extract array of users from a few possible response shapes
			const parsed = res  && res.data && res.data.data ? res.data.data : null
			
			let usersArray = []
			if (Array.isArray(parsed)) usersArray = parsed
			else if (Array.isArray(parsed.data)) usersArray = parsed.data
			else if (Array.isArray(parsed.users)) usersArray = parsed.users
			else if (Array.isArray(parsed.data && parsed.data.users)) usersArray = parsed.data.users
			else if (Array.isArray(parsed.data && parsed.data.data)) usersArray = parsed.data.data

			// dispatch to redux so other pages/components can access all users
			dispatch(setAllUsers(usersArray))
			// res.data expected to contain { user: { ... } }
			// const maybeUser = res && res.data && res.data.data.user ? res.data.data.user : null
			// setUser(maybeUser)
		} catch (err) {
			setUser(null)
			// prefer APIError message if present
			setError(err && err.message ? err.message : 'Failed to load profile')
			// if unauthorized, token might be invalid/expired
			if (err && err.status === 401) {
				try { localStorage.removeItem('token') } catch (e) {}
			}
		} 
	}
	async function getAllChats() {
			setError(null)
			try {
				const res = await fetchAllChats()
				// console.log(res && res.data, 'res from all chats')

				// Try to extract array of chats from a few possible response shapes
				const parsed = res && res.data && res.data.data ? res.data.data : null
				
				let chatsArray = []
				if (Array.isArray(parsed)) chatsArray = parsed
				else if (Array.isArray(parsed.data)) chatsArray = parsed.data
				else if (Array.isArray(parsed.chats)) chatsArray = parsed.chats
				else if (Array.isArray(parsed.data && parsed.data.chats)) chatsArray = parsed.data.chats
// console.log("parsed",chatsArray)
				// dispatch to redux so other pages/components can access all chats
				dispatch(setAllChats(chatsArray))
			} catch (err) {
				// prefer APIError message if present
				setError(err && err.message ? err.message : 'Failed to load chats')
				// if unauthorized, token might be invalid/expired
				if (err && err.status === 401) {
					try { localStorage.removeItem('token') } catch (e) {}
				}
			}
	}

	useEffect(() => {
		loadProfile()
	getAlluser()
	getAllChats()
	}, [])

	return (
		<Layout >
			<Header user={user} />
			<main  className="main-content">
				<Sidebar user={user}></Sidebar>
				<ChatArea></ChatArea>
			</main>
		</Layout>
	)
}
