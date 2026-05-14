import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '../../context/StoreContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  isAuthenticated: boolean;
  role: 'admin' | 'owner' | 'customer' | null;
}

const CATEGORIES = [
  'Téléphones', 'Informatique', 'Mode', 'Électroménager', 
  'Beauté', 'Maison', 'Accessoires', 'Gaming', 
  'Pièces d\'échange', 'Automobile'
];

export default function Header({ isAuthenticated, role }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { logout, currentUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Bar - Promotion/Contact */}
      <div className="bg-secondary text-white py-2 px-4 text-center text-xs font-medium uppercase tracking-widest hidden sm:block">
        Livraison gratuite sur tout le Sénégal à partir de 50 000 FCFA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              S
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-secondary">
              SUNU<span className="text-primary">BUTIK</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-grow max-w-xl">
            <div className="relative w-full group">
              <input 
                type="text" 
                placeholder="Rechercher un produit, une marque..." 
                className="w-full bg-gris border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2.5 pl-12 pr-4 text-sm transition-all outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-600 hover:text-primary transition-colors relative">
              <Heart className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">0</span>
            </button>
            
            <Link to="/cart" className="p-2 text-gray-600 hover:text-primary transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2 bg-gris rounded-full hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    U
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform", isProfileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-50">
                        <p className="text-sm font-bold text-secondary">{currentUser?.displayName || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500 capitalize">{role === 'admin' ? 'Administrateur' : role === 'owner' ? 'Vendeur' : 'Client'}</p>
                      </div>
                      <div className="p-2">
                        {role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gris rounded-lg">Administration</Link>
                        )}
                        {role === 'owner' && (
                          <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gris rounded-lg">Ma Boutique</Link>
                        )}
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gris rounded-lg">Profil</Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gris rounded-lg">Commandes</Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 mt-2"
                        >
                          <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors">Connexion</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-bold bg-secondary text-white rounded-full hover:bg-primary transition-all hover:shadow-lg">Inscription</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Categories - Desktop */}
      <nav className="hidden md:block border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 h-12">
            <li>
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
              >
                <Menu className="w-4 h-4" /> Toutes les Catégories
              </button>
            </li>
            {CATEGORIES.slice(0, 6).map(cat => (
              <li key={cat}>
                <Link to={`/shop?category=${cat}`} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{cat}</Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link to="/subscriptions" className="text-sm font-bold text-primary flex items-center gap-1 animate-pulse">
                Devenir Vendeur
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold font-display text-secondary">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full bg-gris text-secondary">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Link to="/login" className="flex items-center justify-center py-3 rounded-xl border border-gray-200 text-sm font-bold text-secondary">Connexion</Link>
                  <Link to="/register" className="flex items-center justify-center py-3 rounded-xl bg-primary text-white text-sm font-bold">Sinscrire</Link>
                </div>
              )}

              <div className="relative mb-6">
                <input type="text" placeholder="Rechercher..." className="w-full bg-gris border-transparent rounded-xl py-3 pl-12 pr-4 text-sm" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Catégories</p>
                  <div className="grid grid-cols-1 gap-2">
                    {CATEGORIES.map(cat => (
                      <Link key={cat} to={`/shop?category=${cat}`} className="py-2 text-secondary font-medium">{cat}</Link>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Link to="/subscriptions" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary text-white font-bold">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">★</div>
                    Business Pro Membership
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
