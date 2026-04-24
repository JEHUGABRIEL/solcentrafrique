import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { adminLogin } from '../services/adminService';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminLogin(email, password);
      localStorage.setItem('admin_token', response.token);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants invalides.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="bg-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/20">
            <Sun className="h-8 w-8 text-brand-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-brand-secondary">Espace Admin SOL!</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour gérer les installations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Email Professionnel</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-neutral border-2 border-transparent px-12 py-4 rounded-xl focus:border-brand-primary focus:ring-0 outline-none transition-all"
                placeholder="admin@sol.rca"
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
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Se Connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Accès réservé au personnel technique et administratif de SOL! Centrafrique.
        </p>
      </motion.div>
    </div>
  );
}
