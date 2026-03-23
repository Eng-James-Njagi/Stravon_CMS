'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useKindeBrowserClient, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'
import '../components/css/nav.css'

export default function Navbar() {
  const { isAuthenticated, user } = useKindeBrowserClient()
  const prevAuth = useRef(null)

  useEffect(() => {
    if (prevAuth.current === null) {
      prevAuth.current = isAuthenticated
      return
    }
    if (prevAuth.current === false && isAuthenticated === true) {
      toast.success(`Welcome back${user?.given_name ? `, ${user.given_name}` : ''}!`)
    }
    if (prevAuth.current === true && isAuthenticated === false) {
      toast.success('You have been logged out.')
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated, user])

  return (
    <nav className="nav">
      <Link className="nav-logo" href="/">
        <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="nav-logo-badge" />
        <span className="nav-brand">Stravon Tech Labs</span>
      </Link>

      {!isAuthenticated ? (
        <LoginLink>
          <button className="nav-btn">Log In</button>
        </LoginLink>
      ) : (
        <LogoutLink>
          <button className="nav-btn">Log Out</button>
        </LogoutLink>
      )}
    </nav>
  )
}