import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Users, Network, AlertTriangle, Gamepad2, Puzzle, Menu, X, LogIn, UserPlus, User as UserIcon, Trophy, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Início', icon: Leaf },
  { path: '/biodiversidade', label: 'Vida', icon: Leaf },
  { path: '/estrutura', label: 'Estrutura', icon: Network },
  { path: '/ameacas', label: 'Cuidados', icon: AlertTriangle },
  { path: '/jogo-da-memoria', label: 'Memória', icon: Gamepad2, highlight: 'purple' },
  { path: '/jogo-conexoes', label: 'Conexões', icon: Puzzle, highlight: 'indigo' },
  { path: '/quiz', label: 'Quiz', icon: Trophy, highlight: 'yellow' },
  { path: '/imagens-reais', label: 'Imagens Reais', icon: Camera },
  { path: '/contatos', label: 'Equipe', icon: Users },
];

export function Navbar() {
  const location = useLocation();
  const { usuario, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity flex-shrink-0 min-w-fit">
            <Leaf className="h-8 w-8" />
            <span className="text-xl font-bold hidden md:inline whitespace-nowrap">🌳 Mundo dos Mangues 🦀</span>
            <span className="text-xl font-bold md:hidden">Mangues</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const highlight =
                item.highlight === 'purple'
                  ? 'hover:bg-purple-700'
                  : item.highlight === 'indigo'
                  ? 'hover:bg-indigo-700'
                  : item.highlight === 'yellow'
                  ? 'hover:bg-yellow-700'
                  : 'hover:bg-green-600';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-green-800 text-white shadow-lg ring-2 ring-green-400'
                      : `text-green-100 ${highlight} hover:text-white hover:shadow-md`
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {isAuthenticated && usuario ? (
              <Link
                to="/perfil"
                className="flex items-center space-x-2 bg-green-800 hover:bg-green-900 px-3 py-2 rounded-lg transition-all whitespace-nowrap"
              >
                <div className="text-xl">{usuario.avatar}</div>
                <div className="text-left hidden xl:block">
                  <div className="text-xs font-bold">{usuario.nome}</div>
                  <div className="text-xs text-green-200 flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    {usuario.total_pontos} pts
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-green-800 hover:bg-green-900 font-bold text-sm transition-all whitespace-nowrap"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
                <Link
                  to="/cadastro"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-bold text-sm transition-all whitespace-nowrap"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden xl:inline">Cadastrar</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center p-2 rounded-lg hover:bg-green-800 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-2 pb-4 space-y-2">
            {/* User Section Mobile */}
            {isAuthenticated && usuario ? (
              <Link
                to="/perfil"
                onClick={handleNavClick}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-green-800 hover:bg-green-900 transition-all"
              >
                <div className="text-3xl">{usuario.avatar}</div>
                <div className="flex-1">
                  <div className="font-bold">{usuario.nome}</div>
                  <div className="text-sm text-green-200 flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    {usuario.total_pontos} pontos
                  </div>
                </div>
                <UserIcon className="h-5 w-5" />
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-green-800 hover:bg-green-900 font-bold transition-all"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Entrar</span>
                </Link>
                <Link
                  to="/cadastro"
                  onClick={handleNavClick}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold transition-all"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Criar Conta</span>
                </Link>
              </div>
            )}

            {/* Navigation Items Mobile */}
            <div className="pt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const highlight =
                  item.highlight === 'purple'
                    ? 'hover:bg-purple-700'
                    : item.highlight === 'indigo'
                    ? 'hover:bg-indigo-700'
                    : item.highlight === 'yellow'
                    ? 'hover:bg-yellow-700'
                    : 'hover:bg-green-600';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-green-800 text-white shadow-lg ring-2 ring-green-400'
                        : `text-green-100 ${highlight} hover:text-white hover:shadow-md`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}