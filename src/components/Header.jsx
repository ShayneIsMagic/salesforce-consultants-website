import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">
              Salesforce Consultants
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${
                  isActive(item.href) ? 'nav-link-active' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/contact"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 