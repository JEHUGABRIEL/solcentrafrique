import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Leaf, Star, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVICES, PROJECTS, TESTIMONIALS } from '../constants';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=65&w=1600",
    title: "L'énergie solaire pour tous",
    subtitle: "Économisez, écologisez, profitez. Installation et maintenance experte en Centrafrique."
  },
  {
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=65&w=1600",
    title: "Illuminez votre Avenir avec SOL!",
    subtitle: "Villas, commerces, ou centres de santé : nous électrifions vos projets avec excellence."
  },
  {
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=65&w=1600",
    title: "Expertise Solaire à Bangui",
    subtitle: "Une maintenance garantie et des composants premium pour une sérénité sur le long terme."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="pt-20">
      {/* Hero Section with Carousel */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-brand-secondary/60 backdrop-blur-[2px] z-[1]" />
            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt="Installation Solaire SOL! RCA" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                {HERO_SLIDES[currentSlide].title}<span className="text-brand-primary">.</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl font-light">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/contact" 
                  className="bg-brand-primary text-brand-secondary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  Obtenir mon devis gratuit
                </Link>
                <Link 
                  to="/portfolio" 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  Nos réalisations
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
          <div className="flex gap-2">
            <button 
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-brand-primary hover:text-brand-secondary text-white backdrop-blur-md transition-all border border-white/10"
              aria-label="Slide précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-brand-primary hover:text-brand-secondary text-white backdrop-blur-md transition-all border border-white/10"
              aria-label="Slide suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8 bg-brand-primary" : "w-2 bg-white/30"
                }`}
                aria-label={`Aller à la slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Solar? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">Pourquoi passer au solaire ?</h2>
            <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: Zap, 
                title: 'Économies', 
                desc: 'Réduisez votre facture électrique de 60-80% dès le premier mois.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Fiabilité', 
                desc: 'Une électricité stable 24h/24 sans coupures ni dépendance au réseau.' 
              },
              { 
                icon: Leaf, 
                title: 'Écologie', 
                desc: 'Utilisez une énergie propre et inépuisable pour protéger notre biodiversité.' 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="bg-brand-neutral p-8 rounded-3xl text-center hover:shadow-xl transition-all"
              >
                <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6 text-brand-primary">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-secondary mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Services */}
      <section className="py-24 bg-brand-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-2">Nos Solutions</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Des services adaptés à vos besoins</h2>
            </div>
            <Link to="/services" className="text-brand-primary font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
              Voir tout nos services <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 300 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all group relative"
              >
                <h3 className="text-xl font-bold text-white mb-4 pr-10">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3">{service.description}</p>
                <Link 
                  to={`/services#${service.id}`} 
                  className="text-brand-primary text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 bg-brand-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-2">Portfolio</p>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary">Nos derniers projets phares</h2>
            </div>
            <Link to="/portfolio" className="bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold text-sm">
              Découvrir tous les projets
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PROJECTS.map((project, idx) => (
              <motion.div 
                key={project.id}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="h-56 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-brand-secondary">{project.title}</h3>
                    <span className="bg-brand-accent/10 text-brand-accent text-xs font-bold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-brand-accent font-bold text-sm mb-4">{project.roi}</p>
                  <p className="text-gray-500 text-sm">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full -ml-48 -mb-48" />
         
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <h2 className="text-3xl font-bold text-brand-secondary mb-12">Ce que disent nos clients</h2>
           <div className="space-y-12">
             {TESTIMONIALS.map((t, idx) => (
               <motion.div 
                key={t.id}
                {...fadeIn}
                className="relative"
               >
                 <div className="flex justify-center mb-6">
                   {[...Array(t.rating)].map((_, i) => (
                     <Star key={i} className="h-5 w-5 text-brand-primary fill-brand-primary" />
                   ))}
                 </div>
                 <blockquote className="text-2xl font-medium text-brand-secondary italic mb-6">
                   "{t.text}"
                 </blockquote>
                 <cite className="not-italic font-bold text-gray-500">— {t.name}</cite>
               </motion.div>
             ))}
           </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <h2 className="text-4xl md:text-5xl font-bold text-brand-secondary mb-6">Prêt à passer au solaire ?</h2>
            <p className="text-lg text-brand-secondary/80 mb-10 max-w-2xl mx-auto">
              Contactez-nous aujourd'hui pour une étude de faisabilité gratuite et découvrez comment vous pouvez devenir autonome.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-brand-secondary text-white px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl"
              >
                Demander mon devis
              </Link>
              <a 
                href="tel:+23670000000" 
                className="bg-white text-brand-secondary px-10 py-5 rounded-full font-bold text-xl hover:bg-brand-neutral transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-6 w-6" /> Appeler SOL!
              </a>
            </div>
            <p className="mt-8 text-brand-secondary font-semibold">+236 XX XX XX XX</p>
          </div>
        </div>
      </section>
    </div>
  );
}
