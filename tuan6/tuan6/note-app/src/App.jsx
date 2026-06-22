import { useState } from "react"
import { Link } from "react-router-dom"
import clsx from "clsx"
import NoteManager from "./pages/NoteManager"

// Icons
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const NoteIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconBtn = ({ onClick, label, children }) => (
  <button
    onClick={onClick}
    className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
    aria-label={label}
  >
    {children}
  </button>
)

const Header = ({ dark, setDark }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: "Ghi chú", to: "/" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-sm shadow-primary-600/30">
              <NoteIcon />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              NoteApp
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <IconBtn onClick={() => setDark(!dark)} label="Đổi theme">
              {dark ? <SunIcon /> : <MoonIcon />}
            </IconBtn>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          © 2026 NoteApp. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Chính sách bảo mật
          </a>
          <a href="#" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Điều khoản sử dụng
          </a>
        </div>
      </div>
    </div>
  </footer>
)

function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark"
    }
    return false
  })

  if (typeof window !== "undefined") {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header dark={dark} setDark={setDark} />

      <main id="main-content" className="flex-1">
        <NoteManager />
      </main>

      <Footer />
    </div>
  )
}

export default App
