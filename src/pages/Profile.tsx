import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Package, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-neutral">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-secondary p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-2xl overflow-hidden">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E67E22&color=fff`} 
                  alt={user.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black mb-2">{user.name}</h1>
                <p className="text-white/60 font-medium flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 bg-brand-primary text-brand-secondary text-[10px] font-black uppercase tracking-widest rounded-full">
                    <Shield className="h-3 w-3" /> Administrateur
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h2 className="text-xl font-black text-brand-secondary flex items-center gap-3">
                  <User className="h-6 w-6 text-brand-primary" /> Informations Personnelles
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-brand-neutral rounded-2xl">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                      <p className="font-bold text-brand-secondary">+236 70 00 00 00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-brand-neutral rounded-2xl">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adresse</p>
                      <p className="font-bold text-brand-secondary">Bangui, République Centrafricaine</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-black text-brand-secondary flex items-center gap-3">
                  <Package className="h-6 w-6 text-brand-primary" /> Mes Commandes
                </h2>
                <div className="bg-brand-neutral p-8 rounded-3xl text-center border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold text-sm">Vous n'avez pas encore de commande.</p>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="mt-4 text-brand-primary font-black hover:underline text-sm"
                  >
                    Visiter la boutique
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-100 flex flex-wrap gap-4">
              <button className="bg-white border border-gray-200 text-brand-secondary px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:border-brand-primary transition-all shadow-sm">
                <Settings className="h-5 w-5" /> Modifier le profil
              </button>
              {isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="bg-brand-primary text-brand-secondary px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Shield className="h-5 w-5" /> Accès Admin
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-red-100 transition-all ml-auto"
              >
                <LogOut className="h-5 w-5" /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
