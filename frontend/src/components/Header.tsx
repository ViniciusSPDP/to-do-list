'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  nomeUsuario: string;
}

export default function Header({ nomeUsuario }: HeaderProps) {
  const router = useRouter();
  const [primeiraLetra, setPrimeiraLetra] = useState('');
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nomeUsuario) {
      setPrimeiraLetra(nomeUsuario.charAt(0).toUpperCase());
      setPrimeiroNome(nomeUsuario.split(' ')[0]);
    }
  }, [nomeUsuario]);

  // Fecha o menu quando o usuário clica fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      router.push('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center bg-gradient-to-r from-purple-700 to-purple-500 p-4 text-white shadow-lg ">
      <div className="flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-purple-200"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <h1 className="text-xl font-bold tracking-wide">TO-DO-LIST</h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          className="flex cursor-pointer items-center space-x-3 py-2 px-3 rounded-full hover:bg-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
          onClick={toggleMenu}
          aria-expanded={showMenu}
          aria-haspopup="true"
          aria-label="Menu do usuário"
        >
          <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-lg font-semibold shadow-inner border-2 border-purple-300">
            {primeiraLetra}
          </div>
          <span className="text-md font-medium">{primeiroNome}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 border border-purple-100">
            <div className="p-2 border-b border-gray-100">
              <p className="text-sm text-gray-500">Logado como</p>
              <p className="font-medium truncate">{nomeUsuario}</p>
            </div>
            <div className="p-1">
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer text-left px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-100 transition-colors duration-200 focus:outline-none focus:bg-purple-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}