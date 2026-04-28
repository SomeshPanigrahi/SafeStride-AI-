import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Activity, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>SafeStride<span className={styles.logoAi}>AI</span></span>
        </Link>

        {isAuthenticated && (
          <>
            <div className={styles.links}>
              <Link to="/dashboard" className={`${styles.link} ${location.pathname === '/dashboard' ? styles.active : ''}`}>
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <Link to="/runs" className={`${styles.link} ${location.pathname === '/runs' ? styles.active : ''}`}>
                <Activity size={15} />
                Run Log
              </Link>
            </div>

            <div className={styles.right}>
              <div className={styles.userChip}>
                <span className={styles.userDot} />
                <span className={styles.userName}>{user?.name || user?.email?.split('@')[0]}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                <LogOut size={16} />
              </button>
            </div>

            <button className={styles.menuToggle} onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {isAuthenticated && menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/runs" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <Activity size={16} /> Run Log
          </Link>
          <button onClick={handleLogout} className={styles.mobileLinkBtn}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}