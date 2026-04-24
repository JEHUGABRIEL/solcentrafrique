import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Award, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export default function About() {
  const stats = [
    { label: "Projets Réalisés", value: "250+", icon: Target },
    { label: "Économisés / an", value: "85M FCFA", icon: Award },
    { label: "Années d'Expérience", value: "10 Ans", icon: BookOpen },
    { label: "Clients Heureux", value: "98%", icon: Users },
  ];

  return (
    <div className="pt-20">
      {/* Story */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">Notre Histoire</p>
              <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary mb-8 leading-tight">
                Pionnier du solaire en République Centrafrique
              </h1>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Fondée avec la mission de démocratiser l'énergie en RCA, SOL! est devenue en quelques années l'acteur de référence pour les solutions énergétiques autonomes.
                </p>
                <p>
                  Dans un pays où l'accès à l'électricité reste un défi majeur, nous croyons fermement que le soleil centrafricain est notre plus grande richesse. Nous transformons cette ressource naturelle en confort pour les familles et en productivité pour les entreprises.
                </p>
                <p>
                  Nos équipes sont composées d'ingénieurs et de techniciens locaux hautement qualifiés, formés aux dernières technologies photovoltaïques.
                </p>
              </div>
            </motion.div>
            
            <div className="relative">
              <div className="aspect-square bg-brand-primary/10 rounded-[4rem] absolute -bottom-10 -left-10 w-full h-full -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1544725121-be3b54124cb2?auto=format&fit=crop&q=60&w=800" 
                alt="Our Team" 
                className="w-full h-full object-cover rounded-[4rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-secondary">Nos Valeurs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                title: "Excellence Technique", 
                desc: "Nous ne faisons aucun compromis sur la qualité du matériel et de l'installation." 
              },
              { 
                title: "Engagement Local", 
                desc: "Nous employons et formons des techniciens centrafricains pour un impact durable." 
              },
              { 
                title: "Proximité Client", 
                desc: "Un service après-vente présent à Bangui pour intervenir en moins de 24h." 
              }
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-1 bg-brand-primary mb-6 group-hover:w-full transition-all duration-500" />
                <h4 className="text-xl font-bold text-brand-secondary mb-4">{v.title}</h4>
                <p className="text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">Témoignages</p>
            <h2 className="text-3xl font-bold text-brand-secondary">Ils nous font confiance</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-neutral p-10 rounded-[3rem] relative overflow-hidden"
              >
                <Quote className="absolute top-10 right-10 h-16 w-16 text-brand-primary/10 -rotate-12" />
                <div className="flex gap-1 mb-6 text-brand-primary">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-brand-secondary/80 italic leading-relaxed mb-8 relative z-10">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center font-bold text-brand-secondary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-secondary">{testimonial.name}</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Client Vérifié</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
