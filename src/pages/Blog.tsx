import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, Search, X, Share2, Facebook, Linkedin, Loader2, MessageCircle, AlertCircle, CheckCircle2, MessageSquare, ImageIcon, Trash2, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Comment {
  id: string;
  postId: number;
  name: string;
  email: string;
  message: string;
  image?: string;
  date: string;
}

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
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sharePost, setSharePost] = useState<{title: string, id: number} | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null);
  const [selectedCommentImage, setSelectedCommentImage] = useState<string | null>(null);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '', image: '' });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
  const COMMENTS_PER_PAGE = 5;

  useEffect(() => {
    const savedComments = localStorage.getItem('blog_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.message) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    setIsSubmittingComment(true);
    setTimeout(() => {
      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        postId: selectedPost!.id,
        name: commentForm.name,
        email: commentForm.email,
        message: commentForm.message,
        image: commentForm.image || undefined,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      const updatedComments = [newComment, ...comments];
      setComments(updatedComments);
      localStorage.setItem('blog_comments', JSON.stringify(updatedComments));
      setCommentForm({ name: '', email: '', message: '', image: '' });
      setIsSubmittingComment(false);
      showToast("Merci pour votre commentaire !", "success");
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPostComments = comments.filter(c => c.postId === selectedPost?.id);
  const totalCommentsPages = Math.ceil(currentPostComments.length / COMMENTS_PER_PAGE);
  const paginatedComments = currentPostComments.slice(
    (commentsCurrentPage - 1) * COMMENTS_PER_PAGE,
    commentsCurrentPage * COMMENTS_PER_PAGE
  );

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

                  <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Partager :</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleShare('facebook', selectedPost.title)} className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-xl hover:bg-[#1877F2] hover:text-white transition-all"><Facebook className="h-5 w-5" /></button>
                        <button onClick={() => handleShare('linkedin', selectedPost.title)} className="p-3 bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl hover:bg-[#0A66C2] hover:text-white transition-all"><Linkedin className="h-5 w-5" /></button>
                        <button onClick={() => handleShare('whatsapp', selectedPost.title)} className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><MessageCircle className="h-5 w-5" /></button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSharePost({ title: selectedPost.title, id: selectedPost.id })}
                      className="flex items-center gap-2 bg-brand-neutral px-6 py-3 rounded-xl font-bold text-brand-secondary hover:bg-brand-primary transition-colors"
                    >
                      <Share2 className="h-5 w-5" /> Plus d'options
                    </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h3 className="text-2xl font-black text-brand-secondary px-6 shrink-0 flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-brand-primary" />
                    Commentaires ({currentPostComments.length})
                  </h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Comments List with Pagination */}
                {currentPostComments.length > 0 ? (
                  <div className="space-y-8 mb-20">
                    <div className="grid gap-6">
                      <AnimatePresence mode="popLayout">
                        {paginatedComments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-secondary/5 border border-gray-100"
                          >
                            <div className="flex flex-col md:flex-row gap-8">
                              {comment.image && (
                                <div 
                                  className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 cursor-zoom-in relative group/img"
                                  onClick={() => setSelectedCommentImage(comment.image!)}
                                >
                                  <img 
                                    src={comment.image} 
                                    alt="Comment attachment" 
                                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-brand-secondary/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                    <ImageIcon className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="font-black text-brand-secondary text-lg">{comment.name}</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{comment.date}</p>
                                  </div>
                                  <Quote className="h-8 w-8 text-brand-primary/10" />
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                  {comment.message}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {totalCommentsPages > 1 && (
                      <div className="flex justify-center items-center gap-4 py-8">
                        <button 
                          onClick={() => setCommentsCurrentPage(p => Math.max(1, p - 1))}
                          disabled={commentsCurrentPage === 1}
                          className="p-4 bg-white border border-gray-100 rounded-2xl text-brand-secondary hover:bg-brand-primary disabled:opacity-30 transition-all shadow-sm"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-brand-secondary">
                          Page {commentsCurrentPage} <span className="text-gray-400">/ {totalCommentsPages}</span>
                        </span>
                        <button 
                          onClick={() => setCommentsCurrentPage(p => Math.min(totalCommentsPages, p + 1))}
                          disabled={commentsCurrentPage === totalCommentsPages}
                          className="p-4 bg-white border border-gray-100 rounded-2xl text-brand-secondary hover:bg-brand-primary disabled:opacity-30 transition-all shadow-sm"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-brand-neutral/30 rounded-[3rem] border-2 border-dashed border-gray-200 mb-20">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Soyez le premier à commenter !</p>
                  </div>
                )}

                {/* Comment Form */}
                <div className="bg-brand-secondary p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-2 tracking-tighter">Laissez un commentaire</h3>
                    <p className="text-white/60 mb-10 font-medium">Votre adresse email ne sera pas publiée.</p>

                    <form onSubmit={handleCommentSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-4">Nom Complet*</label>
                          <input 
                            type="text" 
                            required
                            value={commentForm.name}
                            onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                            placeholder="Ex: Jean Dupont"
                            className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 focus:border-brand-primary outline-none transition-all placeholder:text-white/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-4">Email*</label>
                          <input 
                            type="email" 
                            required
                            value={commentForm.email}
                            onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                            placeholder="Ex: jean@domaine.com"
                            className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 focus:border-brand-primary outline-none transition-all placeholder:text-white/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 ml-4">Message*</label>
                        <textarea 
                          required
                          rows={4}
                          value={commentForm.message}
                          onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                          placeholder="Votre avis nous intéresse..."
                          className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 focus:border-brand-primary outline-none transition-all placeholder:text-white/20 resize-none"
                        ></textarea>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group">
                          <input 
                            type="file" 
                            id="comment-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="comment-image"
                            className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-white shrink-0"
                          >
                            <ImageIcon className="h-5 w-5 text-brand-primary" />
                            {commentForm.image ? 'Image ajoutée' : 'Ajouter une photo'}
                          </label>
                          {commentForm.image && (
                            <button 
                              type="button"
                              onClick={() => setCommentForm({ ...commentForm, image: '' })}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110 transition-all shadow-lg"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        <button 
                          type="submit"
                          disabled={isSubmittingComment}
                          className="w-full md:flex-1 bg-brand-primary text-brand-secondary font-black px-10 py-4 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isSubmittingComment ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" /> Envoi...
                            </>
                          ) : (
                            <>
                              Publier le commentaire <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>

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
                              <button onClick={(e) => { e.stopPropagation(); handleShare('facebook', post.title); }} className="bg-white text-[#1877F2] p-3 rounded-xl shadow-lg hover:bg-[#1877F2] hover:text-white transition-all"><Facebook className="h-4 w-4" /></button>
                              <button onClick={(e) => { e.stopPropagation(); handleShare('whatsapp', post.title); }} className="bg-white text-green-600 p-3 rounded-xl shadow-lg hover:bg-green-600 hover:text-white transition-all"><MessageCircle className="h-4 w-4" /></button>
                              <button onClick={(e) => { e.stopPropagation(); setSharePost({ title: post.title, id: post.id }); }} className="bg-white text-brand-secondary p-3 rounded-xl shadow-lg hover:bg-brand-primary transition-colors flex items-center gap-2 font-bold text-xs"><Share2 className="h-4 w-4" /></button>
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

      <AnimatePresence>
        {selectedCommentImage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedCommentImage(null)} 
              className="absolute inset-0 bg-brand-secondary/95 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            >
              <button 
                onClick={() => setSelectedCommentImage(null)} 
                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-8 w-8" />
              </button>
              <img 
                src={selectedCommentImage} 
                alt="Comment detail" 
                className="w-full h-full object-contain rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
