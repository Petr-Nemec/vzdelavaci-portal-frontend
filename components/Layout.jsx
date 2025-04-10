// components/Layout.jsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import { 
  Bars3Icon, 
  XMarkIcon, 
  CalendarIcon, 
  UserIcon, 
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { user, isAuthenticated, isAdmin, isOrganization, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <a className="flex items-center">
                <span className="font-bold text-xl text-blue-600">Vzdělávací portál MSK</span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              <Link href="/">
                <a className={`text-sm font-medium ${router.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  Události
                </a>
              </Link>
              <Link href="/calendar">
                <a className={`text-sm font-medium ${router.pathname === '/calendar' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  Kalendář
                </a>
              </Link>
              <Link href="/organizations">
                <a className={`text-sm font-medium ${router.pathname.startsWith('/organizations') && !router.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  Organizace
                </a>
              </Link>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    <span className="mr-1">{user.name}</span>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    {isAdmin && (
                      <Link href="/admin/dashboard">
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Administrace
                        </a>
                      </Link>
                    )}
                    {isOrganization && (
                      <Link href="/organizations/dashboard">
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Správa organizace
                        </a>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Odhlásit se
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Přihlásit se
                  </a>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            <div className="container mx-auto px-4 space-y-2">
              <Link href="/">
                <a 
                  className={`block py-2 ${router.pathname === '/' ? 'text-blue-600' : 'text-gray-700'}`}
                  onClick={closeMenu}
                >
                  Události
                </a>
              </Link>
              <Link href="/calendar">
                <a 
                  className={`block py-2 ${router.pathname === '/calendar' ? 'text-blue-600' : 'text-gray-700'}`}
                  onClick={closeMenu}
                >
                  Kalendář
                </a>
              </Link>
              <Link href="/organizations">
                <a 
                  className={`block py-2 ${router.pathname.startsWith('/organizations') && !router.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-gray-700'}`}
                  onClick={closeMenu}
                >
                  Organizace
                </a>
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {isAdmin && (
                    <Link href="/admin/dashboard">
                      <a 
                        className="block py-2 text-gray-700"
                        onClick={closeMenu}
                      >
                        Administrace
                      </a>
                    </Link>
                  )}
                  {isOrganization && (
                    <Link href="/organizations/dashboard">
                      <a 
                        className="block py-2 text-gray-700"
                        onClick={closeMenu}
                      >
                        Správa organizace
                      </a>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeMenu();
                      handleSignOut();
                    }}
                    className="block w-full text-left py-2 text-gray-700"
                  >
                    Odhlásit se
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <a 
                    className="block py-2 mt-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={closeMenu}
                  >
                    Přihlásit se
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vzdělávací portál MSK</h3>
              <p className="text-gray-400">
                Platforma pro studenty, organizace a vzdělávací příležitosti v Moravskoslezském kraji
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Užitečné odkazy</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <a className="text-gray-400 hover:text-white">Úvodní stránka</a>
                  </Link>
                </li>
                <li>
                  <Link href="/calendar">
                    <a className="text-gray-400 hover:text-white">Kalendář akcí</a>
                  </Link>
                </li>
                <li>
                  <Link href="/organizations">
                    <a className="text-gray-400 hover:text-white">Organizace</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <p className="text-gray-400">
                Moravskoslezská rada studentů<br />
                email@example.cz<br />
                123 456 789
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Moravskoslezská rada studentů. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
