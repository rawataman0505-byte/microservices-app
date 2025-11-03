import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header({ user }) {
  const router = useRouter()

   function getFullname(){
        let fname = user?.name.toLowerCase();
       
        return fname 
    }

    function getInitials(){
        let f = user?.name.toUpperCase()[0];
        return f;
    }

  function logout() {
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  return (
    // <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', marginBottom: 12 }}>
    //   <div>
    //     <Link href="/home" style={{ fontWeight: 600, textDecoration: 'none', color: '#111827' }}></Link>
    //   </div>

    //   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    //     {user ? (
    //       <>
    //         <div style={{ textAlign: 'right' }}>
    //           <div style={{ fontWeight: 600 }}>{user.name}</div>
    //           <div style={{ fontSize: 12, color: '#6b7280' }}>{user.email}</div>
    //         </div>
    //         <button onClick={handleLogout} style={{ padding: '6px 10px', cursor: 'pointer' }}>Logout</button>
    //       </>
    //     ) : (
    //       <div style={{ display: 'flex', gap: 8 }}>
    //         <Link href="/auth/login">Login</Link>
    //         <Link href="/auth/signup">Signup</Link>
    //       </div>
    //     )}
    //   </div>
    // </header>
    <div className="app-header">
                <div className="app-logo">
                    <i className="fa fa-comments" aria-hidden="true"></i>
                    Quick Chat
                    </div>
                <div className="app-user-profile">
                    <div className="logged-user-name">{ getFullname() }</div>
                    {user?.profilePic && <img src={user?.profilePic} alt="profile-pic" className="logged-user-profile-pic" onClick={ () => navigate('/profile')}></img>}
                    { !user?.profilePic && <div className="logged-user-profile-pic" onClick={ () => navigate('/profile')}>{ getInitials() }</div>}
                    
                    {/* <button className="logout-button" onClick={ logout }>
                        <i className="fa fa-power-off"></i>
                    </button> */}
                    
                </div>
            </div>



  )
}
