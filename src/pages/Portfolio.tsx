import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../constants';
import { X, TrendingUp, Info, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Tous les projets' },
  { id: 'residential', name: 'Résidentiel' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'institutional', name: 'Institutionnel' },
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  const filteredProjects = filter === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-2" aria-hidden="true">Notre Impact</p>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary mb-6">Des réalisations au service de la Centrafrique</h1>
          <p className="text-gray-600 mb-12">
            Découvrez comment nous aidons les foyers et les entreprises à Bangui et en province à atteindre l'autonomie énergétique.
          </p>
        </div>

        {/* Filters */}
        <nav aria-label="Filtrer les projets par catégorie" className="flex flex-wrap gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              aria-pressed={filter === cat.id}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${
                filter === cat.id 
                  ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-brand-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ 
                  duration: 0.4,
                  delay: idx * 0.05,
                  layout: { duration: 0.3 }
                }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                role="button"
                aria-label={`Voir les détails du projet: ${project.title}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={`Installation solaire: ${project.title}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-brand-secondary px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                      <Info className="h-4 w-4" /> Détails
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                    <span className="text-brand-primary font-bold text-xs">{project.roi}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-secondary mb-4">{project.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-24 text-gray-400" role="status">
            Aucun projet dans cette catégorie pour le moment.
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-brand-secondary/80 backdrop-blur-sm z-[60]"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-x-auto md:top-24 md:bottom-24 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden flex flex-col md:flex-row"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white md:text-brand-secondary md:bg-brand-neutral md:hover:bg-gray-200 rounded-full transition-colors z-[80]"
                aria-label="Fermer le modal"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex-1 h-1/2 md:h-auto overflow-hidden relative group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    src={selectedProject.images ? selectedProject.images[activeImageIndex] : selectedProject.image} 
                    alt={`${selectedProject.title} view ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in"
                  />
                </AnimatePresence>

                {selectedProject.images && selectedProject.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-brand-primary hover:text-brand-secondary transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev + 1) % selectedProject.images!.length);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-brand-primary hover:text-brand-secondary transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`h-1.5 rounded-full transition-all ${i === activeImageIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-6 left-6 bg-brand-secondary/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Maximize2 className="h-3 w-3" /> Zoom interactif
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-brand-primary/10 text-brand-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {categories.find(c => c.id === selectedProject.category)?.name}
                  </span>
                </div>
                <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-brand-secondary mb-6">
                  {selectedProject.title}
                </h2>
                
                <div className="bg-brand-neutral p-6 rounded-2xl mb-8 flex items-center gap-4">
                  <div className="bg-brand-primary p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-brand-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Impact Énergétique</p>
                    <p className="text-brand-secondary font-bold text-lg">{selectedProject.roi}</p>
                  </div>
                </div>

                <div className="prose prose-slate mb-8">
                  <h3 className="text-brand-secondary font-bold text-xl mb-4">Description du projet</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.description} 
                    Ce projet a été réalisé avec les plus hauts standards de qualité SOL!. Nous avons utilisé des panneaux de dernière génération pour garantir une production maximale même par temps couvert à Bangui.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-brand-secondary">Spécifications :</h4>
                  <ul className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> Panneaux Tier 1
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> Onduleur Hybride
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> Batteries Lithium
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> Suivi Cloud
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
