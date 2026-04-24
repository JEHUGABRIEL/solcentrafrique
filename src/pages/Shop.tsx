import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Check, Filter, Search, ShoppingBag, MessageSquare, Heart, HeartOff, Loader2, Lock } from 'lucide-react';

const CATEGORIES = ['Tous', 'Panneaux', 'Stockage', 'Onduleurs', 'Kits'];

const ProductSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-8 space-y-4">
      <div className="h-6 bg-gray-200 rounded-full w-3/4" />
      <div className="h-4 bg-gray-200 rounded-full w-full" />
      <div className="h-4 bg-gray-200 rounded-full w-5/6" />
      <div className="pt-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded-full w-12" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
        <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isInCart = (id: string) => cart.some(item => item.id === id);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-brand-primary/20 text-brand-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ShoppingBag className="h-4 w-4" /> Boutique Officielle SOL!
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-brand-secondary mb-6">
            Equipements Haute Performance
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Découvrez notre sélection de matériel certifié Tier 1 pour vos installations solaires en Centrafrique.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-brand-primary text-brand-secondary shadow-md' 
                    : 'text-gray-400 hover:text-brand-secondary hover:bg-brand-neutral'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col group relative"
                >
                  <div className="aspect-square relative overflow-hidden bg-brand-neutral">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase text-brand-primary shadow-sm z-10">
                      {product.category}
                    </div>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-4 right-4 p-3 rounded-xl backdrop-blur-md transition-all z-10 ${
                        favorites.includes(product.id)
                          ? 'bg-brand-primary text-brand-secondary scale-110 shadow-lg'
                          : 'bg-white/50 text-brand-secondary hover:bg-brand-primary hover:text-brand-secondary'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Prix Estimé</p>
                      <p className="text-xl font-black text-brand-secondary">{product.price} FCFA</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login', { state: { from: location } });
                          return;
                        }
                        addToCart({ 
                          id: product.id, 
                          title: product.title, 
                          price: product.price, 
                          image: product.image,
                          type: 'product' 
                        });
                        showToast(`${product.title} ajouté au panier !`, 'success');
                      }}
                      disabled={isInCart(product.id)}
                      className={`p-4 rounded-2xl transition-all relative group ${
                        isInCart(product.id)
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                          : 'bg-brand-neutral text-brand-secondary hover:bg-brand-primary shadow-sm hover:shadow-brand-primary/20'
                      }`}
                    >
                      {!isAuthenticated ? (
                        <div className="flex items-center gap-2">
                           <Lock className="h-5 w-5 opacity-50" />
                           <ShoppingCart className="h-6 w-6" />
                        </div>
                      ) : (
                        isInCart(product.id) ? <Check className="h-6 w-6" /> : <ShoppingCart className="h-6 w-6" />
                      )}
                      
                      {!isAuthenticated && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-brand-secondary text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Connectez-vous pour commander
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-gray-400 font-medium italic">Aucun produit ne correspond à votre recherche.</p>
          </motion.div>
        )}

        {/* WhatsApp Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-brand-secondary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <ShoppingCart className="h-48 w-48" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Besoin d'un conseil technique ?</h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Nos experts vous accompagnent dans le choix du matériel adapté à votre projet. Commandez directement via WhatsApp pour un service ultra-rapide.
            </p>
            <a 
              href="https://wa.me/23675000000" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-primary text-brand-secondary px-10 py-5 rounded-2xl font-bold inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
            >
              <MessageSquare className="h-6 w-6" /> Commander sur WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
