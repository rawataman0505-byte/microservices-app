import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header({ user }) {
  const router = useRouter()

   function getFullname(){
    const name = user?.name || ''
    return name.toLowerCase()
    }

    function getInitials(){
    const name = user?.name || ''
    return name.toUpperCase()[0] || ''
    }

  function logout() {
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  return (
  
    <div className="app-header">
                <div className="app-logo">
                    <i className="fa fa-comments" aria-hidden="true"></i>
                    Quick Chat
                    </div>
                <div className="app-user-profile">
                    <div className="logged-user-name">{ getFullname() }</div>
                    {user?.profilePic && <img src={user?.profilePic} alt="profile-pic" className="logged-user-profile-pic" onClick={ () => router.push('/profile')}></img>}
                    { !user?.profilePic && <div className="logged-user-profile-pic" onClick={ () => router.push('/profile')}>{ getInitials() }</div>}
                    
                    {/* <button className="logout-button" onClick={ logout }>
                        <i className="fa fa-power-off"></i>
                    </button> */}
                    
                </div>
            </div>



  )
}
