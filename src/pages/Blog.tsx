import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, Search, X, Share2, Facebook, Linkedin, Loader2, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    title: "Comment choisir la puissance de son kit solaire ?",
    excerpt: "Calculer ses besoins est la première étape vers l'autonomie. Découvrez notre guide simple.",
    date: "12 Avril 2026",
    author: "Ing. Moussa",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=60&w=800",
    category: "Guides"
  },
  {
    id: 2,
    title: "Le solaire en RCA : Quel avenir pour l'énergie ?",
    excerpt: "L'état des lieux de la transition énergétique en Centrafrique et les opportunités pour 2026.",
    date: "05 Avril 2026",
    author: "Direction SOL!",
    image: "https://images.unsplash.com/photo-1466611653911-95282ee36567?auto=format&fit=crop&q=60&w=800",
    category: "Actualités"
  },
  {
    id: 3,
    title: "Entretien de vos panneaux : 5 conseils d'experts",
    excerpt: "Un panneau propre est un panneau qui produit. Apprenez les bons gestes pour Bangui.",
    date: "28 Mars 2026",
    author: "Service Maintenance",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=60&w=800",
    category: "Entretien"
  },
  {
    id: 4,
    title: "Installation à Birao : Relever les défis logistiques",
    excerpt: "Retour d'expérience sur notre plus grand projet en province cette année.",
    date: "15 Mars 2026",
    author: "Logistique SOL!",
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=60&w=800",
    category: "Projets"
  }
];

const POSTS_PER_PAGE = 3;
const CATEGORIES = ["Tous", "Guides", "Actualités", "Entretien", "Projets"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sharePost, setSharePost] = useState<{title: string, id: number} | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null);

  const activePostForHelmet = selectedPost || (sharePost ? POSTS.find(p => p.id === sharePost.id) : null);

  useEffect(() => {
    if (searchQuery || activeCategory !== "Tous") {
      setIsLoading(true);
      setError(null);
      const timer = setTimeout(() => {
        if (Math.random() < 0.05) {
          setError("Échec de la récupération des articles. Veuillez réessayer.");
        }
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, activeCategory]);

  const filteredPosts = POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Tous" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(1, currentPage - maxVisible);
    let end = Math.min(totalPages, currentPage + maxVisible);
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleShare = (platform: string, title: string) => {
    const url = window.location.href;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      return;
    }
    window.open(shareUrls[platform], '_blank');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Helmet>
        <title>{activePostForHelmet ? `${activePostForHelmet.title} | SOL! Blog` : "Le Blog du Solaire | SOL! Centrafrique"}</title>
        <meta name="description" content={activePostForHelmet ? activePostForHelmet.excerpt : "Découvrez les dernières actualités et conseils sur l'énergie solaire en République Centrafricaine."} />
        <meta property="og:title" content={activePostForHelmet ? activePostForHelmet.title : "Le Blog du Solaire | SOL! Centrafrique"} />
        <meta property="og:description" content={activePostForHelmet ? activePostForHelmet.excerpt : "Conseils experts et actualités énergétiques pour Bangui et ses environs."} />
        <meta property="og:image" content={activePostForHelmet ? activePostForHelmet.image : "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=1200"} />
        <meta property="og:site_name" content="SOL! Centrafrique" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activePostForHelmet ? activePostForHelmet.title : "Le Blog du Solaire | SOL! Centrafrique"} />
        <meta name="twitter:description" content={activePostForHelmet ? activePostForHelmet.excerpt : "Dernières actualités du solaire en RCA."} />
        <meta name="twitter:image" content={activePostForHelmet ? activePostForHelmet.image : "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=1200"} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <motion.div 
              key="post-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-brand-primary font-bold mb-8 hover:gap-3 transition-all"
              >
                <ArrowRight className="h-5 w-5 rotate-180" /> Retour au blog
              </button>

              <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 mb-16">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-[400px] object-cover" />
                <div className="p-12">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg">{selectedPost.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {selectedPost.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {selectedPost.author}</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-brand-secondary mb-8 leading-tight">
                    {selectedPost.title}
                  </h1>

                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                    <p className="text-xl font-medium text-brand-secondary italic">
                      {selectedPost.excerpt}
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>

                  <div className="mt-12 pt-12 border-t border-gray-100 flex justify-between items-center">
                    <button 
                      onClick={() => setSharePost({ title: selectedPost.title, id: selectedPost.id })}
                      className="flex items-center gap-2 bg-brand-neutral px-6 py-3 rounded-xl font-bold text-brand-secondary hover:bg-brand-primary transition-colors"
                    >
                      <Share2 className="h-5 w-5" /> Partager l'article
                    </button>
                  </div>
                </div>
              </div>

              <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h3 className="text-2xl font-bold text-brand-secondary px-4">Articles Similaires</h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {POSTS.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
                    <motion.div 
                      key={post.id}
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        setSelectedPost(post);
                        window.scrollTo(0, 0);
                      }}
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex gap-6 cursor-pointer group"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">{post.category}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="post-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
                <div className="max-w-2xl">
                  <p className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2" aria-hidden="true">Conseils & News</p>
                  <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary mb-6">Le Blog du Solaire</h1>
                  <p className="text-gray-600">
                    Restez informé des dernières technologies et apprenez à optimiser votre consommation d'énergie en Centrafrique.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20 scale-105' : 'bg-white text-gray-400 hover:text-brand-secondary border border-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="w-full lg:max-w-sm relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-brand-primary" /> : <Search className="h-5 w-5" />}
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un conseil..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-white border border-gray-100 px-14 py-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 p-1">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {error ? (
                <div className="text-center py-24 bg-red-50 rounded-[2rem] border border-red-100">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-bold mb-4">{error}</p>
                  <button onClick={() => { setError(null); setActiveCategory("Tous"); setSearchQuery(''); }} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold">Réinitialiser</button>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="h-10 w-10 animate-spin text-brand-primary mb-4" />
                  <p className="text-gray-500 font-bold">Recherche des meilleurs articles...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                  <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Aucun article ne correspond à "{searchQuery}"</p>
                  <button onClick={() => setSearchQuery('')} className="mt-4 text-brand-primary font-bold hover:underline">Voir tous les articles</button>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                      {paginatedPosts.map((post) => (
                        <motion.article 
                          layout
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer"
                          onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                        >
                          <div className="h-64 overflow-hidden relative">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-brand-secondary">{post.category}</div>
                            <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform">
                              <button onClick={(e) => { e.stopPropagation(); setSharePost({ title: post.title, id: post.id }); }} className="bg-white text-brand-secondary p-3 rounded-xl shadow-lg hover:bg-brand-primary transition-colors flex items-center gap-2 font-bold text-xs"><Share2 className="h-4 w-4" /> Partager</button>
                            </div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                              <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {post.author}</span>
                            </div>
                            <h2 className="text-xl font-bold text-brand-secondary mb-4 group-hover:text-brand-primary transition-colors">{post.title}</h2>
                            <p className="text-gray-500 text-sm mb-8 flex-1 line-clamp-3">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-brand-secondary font-bold text-sm group-hover:gap-3 transition-all">Lire la suite <ArrowRight className="h-4 w-4 text-brand-primary" /></div>
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>

                  {totalPages > 1 && (
                    <nav className="mt-16 flex justify-center items-center gap-2" aria-label="Pagination">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-xl bg-white hover:bg-brand-primary disabled:opacity-30 transition-all shadow-sm"><ArrowRight className="h-5 w-5 rotate-180" /></button>
                      <div className="flex gap-2">
                        {getPageNumbers().map((page, i) => (
                          page === '...' ? <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span> :
                          <button key={i} onClick={() => setCurrentPage(Number(page))} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page ? 'bg-brand-primary text-brand-secondary shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-brand-primary'}`}>{page}</button>
                        ))}
                      </div>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 rounded-xl bg-white hover:bg-brand-primary disabled:opacity-30 transition-all shadow-sm"><ArrowRight className="h-5 w-5" /></button>
                    </nav>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sharePost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSharePost(null)} className="absolute inset-0 bg-brand-secondary/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl overflow-hidden">
              <button onClick={() => setSharePost(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-secondary" aria-label="Fermer"><X className="h-6 w-6" /></button>
              <div className="text-center mb-10">
                <div className="bg-brand-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><Share2 className="h-8 w-8 text-brand-primary" /></div>
                <h3 className="text-2xl font-bold text-brand-secondary mb-2">Partager cet article</h3>
                <p className="text-gray-500 text-sm px-6">Faites circuler l'énergie positive avec vos proches.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleShare('whatsapp', sharePost.title)} className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-green-50 transition-all group">
                  <div className="bg-green-500 p-4 rounded-xl text-white group-hover:scale-110 transition-transform"><MessageCircle className="h-6 w-6" /></div>
                  <span className="font-bold text-sm text-gray-600">WhatsApp</span>
                </button>
                <button onClick={() => handleShare('facebook', sharePost.title)} className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-blue-50 transition-all group">
                  <div className="bg-[#1877F2] p-4 rounded-xl text-white group-hover:scale-110 transition-transform"><Facebook className="h-6 w-6" /></div>
                  <span className="font-bold text-sm text-gray-600">Facebook</span>
                </button>
                <button onClick={() => handleShare('linkedin', sharePost.title)} className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-blue-50 transition-all group">
                  <div className="bg-[#0A66C2] p-4 rounded-xl text-white group-hover:scale-110 transition-transform"><Linkedin className="h-6 w-6" /></div>
                  <span className="font-bold text-sm text-gray-600">LinkedIn</span>
                </button>
                <button onClick={() => handleShare('copy', sharePost.title)} className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-brand-primary/10 transition-all group relative overflow-hidden">
                  <div className={`${showCopied ? 'bg-green-500' : 'bg-brand-secondary'} p-4 rounded-xl text-white transition-colors`}>{showCopied ? <CheckCircle2 className="h-6 w-6" /> : <Share2 className="h-6 w-6 rotate-45" />}</div>
                  <span className="font-bold text-sm text-gray-600">{showCopied ? 'Copié !' : 'Lien'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
