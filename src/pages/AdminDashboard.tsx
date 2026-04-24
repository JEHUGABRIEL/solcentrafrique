import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
  BarChart3, Users, Zap, ClipboardList, TrendingUp, DollarSign, 
  Download, RefreshCcw, AlertCircle, LogOut, Loader2, Search 
} from 'lucide-react';
import { fetchDashboardData, exportToCSV, DashboardData } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#FFD700', '#1A2E35', '#FF4D00'];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePieIndex, setActivePieIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProjects = data?.recentProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    setError(null);
    try {
      const response = await fetchDashboardData();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_token');
    if (!isAuth) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const onPieEnter = (_: any, index: number) => {
    setActivePieIndex(index);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-secondary p-4 rounded-xl shadow-xl border border-white/10 text-white">
          <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-1">{label}</p>
          <p className="text-lg font-black">{payload[0].value} Projets</p>
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    if (!data) return;
    const exportData = [
      { Metric: "Projets Totaux", Value: data.totalProjects },
      { Metric: "Économies Moyennes", Value: data.avgSavings },
      { Metric: "Demandes de Devis (30j)", Value: data.quoteRequests },
      { Metric: "Satisfaction Client", Value: data.satisfaction }
    ];
    exportToCSV(exportData, 'sol_stats_summary');
  };

  const handleExportHistory = () => {
    if (!data) return;
    exportToCSV(data.growth, 'sol_growth_history');
  };

  const handleExportLogins = () => {
    if (!data) return;
    exportToCSV(data.loginAttempts, 'sol_login_attempts');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-neutral">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="text-brand-secondary font-bold text-center">
          <span className="block text-2xl font-black mb-2">SOL! Admin</span>
          Chargement du tableau de bord...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-neutral">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-red-100">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-brand-secondary mb-4">Erreur de chargement</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <div className="flex gap-4">
            <button 
              onClick={() => loadData()}
              className="flex-1 bg-brand-primary text-brand-secondary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <RefreshCcw className="h-5 w-5" /> Réessayer
            </button>
            <button 
              onClick={() => navigate('/admin/login')}
              className="px-6 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Projets Totaux", value: data.totalProjects, icon: Zap, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Économies Moy./Client", value: data.avgSavings, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { label: "Demandes de Devis (30j)", value: data.quoteRequests, icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Satisfaction Client", value: data.satisfaction, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F8F9FA] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Portail Expert SOL!
              </span>
              {isRefreshing && (
                <div className="flex items-center gap-2 text-brand-primary text-[10px] font-bold animate-pulse">
                  <RefreshCcw className="h-3 w-3 animate-spin" /> SYNCHRONISATION...
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black text-brand-secondary flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-brand-primary" /> Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Données consolidées de SOL! République Centrafricaine</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="bg-white border border-gray-200 text-brand-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:border-brand-primary transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Rafraîchir les données"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Actualiser
            </button>
            <button 
              onClick={handleExport}
              className="bg-white border border-gray-200 text-brand-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:border-brand-primary transition-all shadow-sm"
            >
              <Download className="h-4 w-4" /> Export Résumé
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all shadow-sm"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-brand-secondary mt-1 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-[520px]"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-black text-xl text-brand-secondary">Croissance Mensuelle</h3>
                <p className="text-sm text-gray-400">Installations par mois (Bangui & Provinces)</p>
              </div>
              <button 
                onClick={handleExportHistory}
                className="p-3 bg-brand-neutral text-gray-400 hover:text-brand-primary rounded-xl transition-all"
                title="Exporter l'historique"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.growth}>
                  <defs>
                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 700}}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 700}}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="#FFD700" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorProjects)" 
                    animationBegin={500}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-[520px]"
          >
            <h3 className="font-black text-xl text-brand-secondary mb-2">Répartition Secteurs</h3>
            <p className="text-sm text-gray-400 mb-8">Par segment de clientèle</p>
            
            <div className="flex-1 w-full flex flex-col justify-center items-center">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.distribution}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={() => setActivePieIndex(-1)}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      animationBegin={800}
                      animationDuration={1200}
                    >
                      {data.distribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          cornerRadius={14}
                          strokeWidth={index === activePieIndex ? 4 : 0}
                          stroke="#fff"
                          className="outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 700 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full space-y-4 mt-10">
                {data.distribution.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${activePieIndex === i ? 'bg-brand-neutral' : ''}`}
                    onMouseEnter={() => setActivePieIndex(i)}
                    onMouseLeave={() => setActivePieIndex(-1)}
                  >
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                      <div className={`w-3 h-3 rounded-full ${COLORS[i % COLORS.length]}`} />
                      {item.label}
                    </div>
                    <span className="font-black text-brand-secondary">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="font-black text-xl text-brand-secondary">Projets Récents</h3>
              <p className="text-sm text-gray-400">Dernières installations et suivis</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Rechercher un projet ou client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-neutral pl-12 pr-6 py-3 rounded-xl border border-transparent focus:border-brand-primary outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-neutral/30">
                  <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Projet</th>
                  <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                  <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-brand-neutral/20 transition-colors">
                    <td className="px-10 py-6">
                      <p className="font-bold text-brand-secondary">{project.name}</p>
                      <p className="text-[10px] text-gray-400">ID: {project.id}</p>
                    </td>
                    <td className="px-10 py-6 text-sm text-gray-600 font-medium">{project.client}</td>
                    <td className="px-10 py-6 text-sm text-gray-500">{project.date}</td>
                    <td className="px-10 py-6 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        project.status === 'Terminé' ? 'bg-green-100 text-green-600' :
                        project.status === 'En cours' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Login Attempts Footer */}
        <div className="mt-12 flex flex-col md:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black text-xl text-brand-secondary">Sécurité</h3>
                <p className="text-sm text-gray-400">Dernières tentatives de connexion</p>
              </div>
              <button 
                onClick={handleExportLogins}
                className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
            <div className="space-y-4">
              {data.loginAttempts.map((attempt, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-brand-neutral rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-brand-secondary">{attempt.email}</p>
                    <p className="text-[10px] text-gray-400">{attempt.timestamp} • IP: {attempt.ip}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                    attempt.status === 'Succès' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                  }`}>
                    {attempt.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
