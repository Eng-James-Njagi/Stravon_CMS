import Image from 'next/image'
import Link from 'next/link'
import '../components/css/nav.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link className="nav-logo" href="/">
        <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="nav-logo-badge" />
        <span className="nav-brand">Stravon Tech Labs</span>
      </Link>
      <button className="nav-btn">Log In</button>
    </nav>
  )
}