import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Phone, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Boutique', path: '/shop' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-primary p-2 rounded-lg">
                <Sun className="h-6 w-6 text-brand-secondary" />
              </div>
              <span className="font-display font-bold text-2xl text-brand-secondary">
                SOL!<span className="text-brand-primary">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors hover:text-brand-primary ${
                  location.pathname === link.path ? 'text-brand-primary' : 'text-brand-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="relative group">
              <Link to="/cart" className="p-2 text-brand-secondary hover:text-brand-primary transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-brand-secondary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            <Link
              to="/contact"
              className="bg-brand-primary text-brand-secondary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-primary/90 transition-all flex items-center gap-2"
            >
              Devis Gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-secondary p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-secondary/40 backdrop-blur-sm z-[-1] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-[60] md:hidden flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                 <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                  <div className="bg-brand-primary p-2 rounded-lg">
                    <Sun className="h-6 w-6 text-brand-secondary" />
                  </div>
                  <span className="font-display font-bold text-2xl text-brand-secondary">SOL!</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="text-brand-secondary p-2">
                  <X className="h-7 w-7" />
                </button>
              </div>

              <div className="space-y-1 flex-grow">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ 
                      type: 'spring',
                      damping: 20,
                      stiffness: 100,
                      delay: idx * 0.05
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-3.5 text-lg font-bold rounded-2xl transition-all relative group ${
                        location.pathname === link.path 
                          ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/10' 
                          : 'text-brand-secondary hover:bg-brand-neutral'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {link.name}
                        {location.pathname === link.path ? (
                           <motion.div layoutId="mobile-active-indicator" className="w-1.5 h-6 bg-brand-secondary rounded-full" />
                        ) : (
                          <div className="w-1 h-1 bg-brand-primary/20 rounded-full group-hover:w-4 transition-all" />
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-8 border-t border-gray-100"
              >
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between mb-6 px-4 hover:bg-brand-neutral p-4 rounded-xl transition-colors">
                  <div className="relative">
                    <ShoppingCart className="h-7 w-7 text-brand-secondary" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-primary text-brand-secondary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Voir mon Panier</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-brand-primary text-brand-secondary px-6 py-5 rounded-2xl font-bold flex justify-center items-center gap-3 shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-transform"
                >
                  <Phone className="h-5 w-5" /> Devis Gratuit
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
