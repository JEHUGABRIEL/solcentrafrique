import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Package, Settings, LogOut, Shield, Heart, HeartOff, ArrowRight, Save, Camera, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';

export default function Profile() {
  const { user, logout, isAdmin, updateProfile } = useAuth();
  const { favorites, toggleFavorite } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const favoriteProducts = PRODUCTS.filter(p => favorites.includes(p.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleFavorite = (productId: string) => {
    const isFavorite = favorites.includes(productId);
    toggleFavorite(productId);
    showToast(
      isFavorite ? "Retiré des favoris" : "Ajouté aux favoris", 
      isFavorite ? "info" : "success"
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile(formData);
      setIsEditing(false);
      showToast("Profil mis à jour avec succès !", "success");
    } catch (error) {
      showToast("Erreur lors de la mise à jour du profil.", "error");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-neutral">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 mb-12">
          <div className="bg-brand-secondary p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative group">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-2xl overflow-hidden relative">
                  <img 
                    src={formData.avatar || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E67E22&color=fff`} 
                    alt={user.name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-brand-secondary/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-8 w-8 text-white" />
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <div className="space-y-4 max-w-xl mx-auto md:mx-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-2 mb-1 block">Nom complet</label>
                        <User className="absolute left-4 top-[38px] h-5 w-5 text-white/40" />
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Votre nom"
                          className="text-xl md:text-2xl font-black tracking-tight bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 outline-none focus:bg-white/20 focus:border-brand-primary/50 w-full transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-2 mb-1 block">Adresse e-mail</label>
                        <Mail className="absolute left-4 top-[38px] h-5 w-5 text-white/40" />
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Votre email"
                          className="text-xl md:text-2xl font-black tracking-tight bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 outline-none focus:bg-white/20 focus:border-brand-primary/50 text-white font-medium w-full transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-2 mb-1 block">Téléphone</label>
                        <Phone className="absolute left-4 top-[38px] h-5 w-5 text-white/40" />
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Téléphone"
                          className="text-xl md:text-2xl font-black tracking-tight bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 outline-none focus:bg-white/20 focus:border-brand-primary/50 text-white font-medium w-full transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-2 mb-1 block">Adresse</label>
                        <MapPin className="absolute left-4 top-[38px] h-5 w-5 text-white/40" />
                        <input 
                          type="text" 
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Adresse"
                          className="text-xl md:text-2xl font-black tracking-tight bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 outline-none focus:bg-white/20 focus:border-brand-primary/50 text-white font-medium w-full transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">{user.name}</h1>
                    <p className="text-white/60 font-medium flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4" /> {user.email}
                    </p>
                  </>
                )}
                {isAdmin && (
                  <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 bg-brand-primary text-brand-secondary text-[10px] font-black uppercase tracking-widest rounded-full">
                    <Shield className="h-3 w-3" /> Administrateur
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || '',
                          address: user.address || '',
                          avatar: user.avatar || ''
                        });
                      }}
                      className="bg-red-500 hover:bg-red-600 p-4 rounded-2xl transition-all shadow-lg"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 p-4 rounded-2xl transition-all shadow-lg"
                    >
                      <Save className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-12">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-8">
                <h2 className="text-xl font-black text-brand-secondary flex items-center gap-3">
                  <User className="h-6 w-6 text-brand-primary" /> Mon Compte
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-5 bg-brand-neutral/50 rounded-2xl border border-gray-100/50">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                      {isEditing ? (
                        <input 
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+236 ..."
                          className="bg-transparent border-b border-brand-primary/30 w-full font-bold text-brand-secondary focus:border-brand-primary outline-none"
                        />
                      ) : (
                        <p className="font-bold text-brand-secondary">{user.phone || '+236 00 00 00 00'}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-brand-neutral/50 rounded-2xl border border-gray-100/50">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adresse</p>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Ex: Bangui, RCA"
                          className="bg-transparent border-b border-brand-primary/30 w-full font-bold text-brand-secondary focus:border-brand-primary outline-none"
                        />
                      ) : (
                        <p className="font-bold text-brand-secondary">{user.address || 'Non spécifiée'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 space-y-3">
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-3 w-full p-4 hover:bg-brand-neutral rounded-xl transition-all font-bold text-sm text-gray-600"
                    >
                      <Settings className="h-5 w-5" /> Modifier les informations
                    </button>
                  )}
                  {isAdmin && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-3 w-full p-4 hover:bg-brand-primary/10 rounded-xl transition-all font-bold text-sm text-brand-primary"
                    >
                      <Shield className="h-5 w-5" /> Panneau Administration
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-brand-secondary flex items-center gap-3">
                    <Package className="h-6 w-6 text-brand-primary" /> Dernières Commandes
                  </h2>
                  <div className="bg-brand-neutral/30 p-10 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
                    <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Package className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold text-sm">Aucune commande enregistrée.</p>
                    <Link 
                      to="/shop"
                      className="mt-6 inline-flex items-center gap-2 bg-brand-secondary text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      Boutique SOL! <ArrowRight className="h-4 w-4 text-brand-primary" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-brand-secondary flex items-center gap-3">
                      <Heart className="h-6 w-6 text-red-500 fill-red-500" /> Mes Favoris
                    </h2>
                    {favoriteProducts.length > 0 && (
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{favoriteProducts.length} articles</span>
                    )}
                  </div>
                  
                  {favoriteProducts.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {favoriteProducts.map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group">
                          <div className="w-20 h-20 bg-brand-neutral rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-brand-secondary text-sm line-clamp-1">{product.title}</h3>
                            <p className="text-brand-primary font-black text-xs mt-1">{product.price} FCFA</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleToggleFavorite(product.id)}
                              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Retirer des favoris"
                            >
                              <HeartOff className="h-4 w-4" />
                            </button>
                            <Link 
                              to="/shop" 
                              className="p-3 bg-brand-neutral rounded-xl hover:bg-brand-primary text-brand-secondary transition-all"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-brand-neutral/30 p-10 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
                       <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Heart className="h-8 w-8 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-bold text-sm">Pas encore de coups de cœur ?</p>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="mt-6 text-brand-primary font-black hover:underline text-[10px] uppercase tracking-[0.2em]"
                      >
                        Explorer les équipements
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
