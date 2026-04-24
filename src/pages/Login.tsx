import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Lock, Mail, AlertCircle, Loader2, UserPlus, LogIn, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@sol.rca' && password === 'bangui2026') {
        login(email, 'admin', 'mock-admin-token');
        navigate('/admin');
      } else if (email && password.length >= 6) {
        login(email, 'user', 'mock-user-token');
        navigate(from, { replace: true });
      } else {
        setError('Identifiants invalides ou mot de passe trop court.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-neutral flex flex-col items-center justify-center px-4 py-20">
      <Link 
        to="/" 
        className="mb-8 flex items-center gap-2 text-brand-secondary font-bold hover:text-brand-primary transition-colors group"
      >
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
          <ChevronLeft className="h-5 w-5" />
        </div>
        Retour à l'accueil
      </Link>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="bg-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/20">
            <Sun className="h-8 w-8 text-brand-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-brand-secondary">
            {isLogin ? 'Bon retour parmi nous !' : 'Rejoindre SOL!'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Connectez-vous pour vos commandes' : 'Créez votre compte client'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-neutral border-2 border-transparent px-12 py-4 rounded-xl focus:border-brand-primary focus:ring-0 outline-none transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Mot de Passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-neutral border-2 border-transparent px-12 py-4 rounded-xl focus:border-brand-primary focus:ring-0 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-100"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-secondary text-white font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-secondary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {isLogin ? 'Se Connecter' : "S'inscrire"}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-brand-primary hover:underline transition-all"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se Connecter"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
          En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </motion.div>
    </div>
  );
}
