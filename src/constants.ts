import { Service, Project, Testimonial, Product } from './types';

export const SERVICES: Service[] = [
  {
    id: 'residential',
    title: 'Installation Résidentielle',
    description: 'Maisons, villas et petits bâtiments. Réduisez vos factures domestiques.',
    icon: 'Home',
    longDescription: 'Nous transformons votre maison en une source d\'énergie autonome. Nos systèmes sont conçus pour durer et s\'adapter à la consommation de votre foyer.',
  },
  {
    id: 'commercial',
    title: 'Installation Commerciale',
    description: 'PME, restaurants, hôtels et ateliers. Optimisez vos coûts d\'exploitation.',
    icon: 'Building2',
    longDescription: 'Les entreprises font face à des coûts énergétiques croissants. Le solaire est l\'investissement le plus rentable pour stabiliser vos dépenses.',
  },
  {
    id: 'institutional',
    title: 'Installation Institutionnelle',
    description: 'ONG, écoles, hôpitaux et administrations. Sécurisez vos services.',
    icon: 'Globe',
    longDescription: 'Pour les structures critiques, l\'absence d\'électricité n\'est pas une option. Nous installons des systèmes robustes avec stockage.',
  },
  {
    id: 'maintenance',
    title: 'Maintenance et Support',
    description: 'Entretien régulier et dépannage rapide pour une longévité maximale.',
    icon: 'Settings',
    longDescription: 'Un panneau sale perd 20% d\'efficacité. Nous assurons le nettoyage, le contrôle technique et le suivi de performance.',
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Villa Moderne - Bangui',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=60&w=800',
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=60&w=800',
      'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=60&w=800',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=60&w=800'
    ],
    roi: 'Économies: 600.000 FCFA/an',
    description: 'Autonomie complète pour une famille de 6 personnes.',
  },
  {
    id: '2',
    title: 'Hôtel Solaire - Boali',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1466611653911-95282ee36567?auto=format&fit=crop&q=60&w=800',
    images: [
      'https://images.unsplash.com/photo-1466611653911-95282ee36567?auto=format&fit=crop&q=60&w=800',
      'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=60&w=800',
      'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=60&w=800'
    ],
    roi: 'Économies: 2.500.000 FCFA/an',
    description: 'Système hybride pour climatisation et éclairage extérieur.',
  },
  {
    id: '3',
    title: 'Centre de Santé - Bimbo',
    category: 'institutional',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=60&w=800',
    images: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=60&w=800',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=60&w=800',
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=60&w=800'
    ],
    roi: 'Impact: Énergie 24h/24',
    description: 'Réfrigération des vaccins sécurisée par batterie lithium.',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Panneau Solaire 450W Mono',
    price: '145.000',
    category: 'Panneaux',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=60&w=600',
    description: 'Cellules monocristallines haute performance, garantie 25 ans.'
  },
  {
    id: 'p2',
    title: 'Batterie Lithium 5kWh',
    price: '950.000',
    category: 'Stockage',
    image: 'https://images.unsplash.com/photo-1548332903-ae366838b4d8?auto=format&fit=crop&q=60&w=600',
    description: 'Longue durée de vie (6000 cycles), design compact.'
  },
  {
    id: 'p3',
    title: 'Onduleur Hybride 5kW',
    price: '420.000',
    category: 'Onduleurs',
    image: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=60&w=600',
    description: 'Gestion intelligente réseau/batterie, wifi inclus.'
  },
  {
    id: 'p4',
    title: 'Kit Solaire Maison 1.5kW',
    price: '1.200.000',
    category: 'Kits',
    image: 'https://images.unsplash.com/photo-1466611653911-95282ee36567?auto=format&fit=crop&q=60&w=600',
    description: 'Solution complète pour éclairage, frigo et TV.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Jean-Paul M.',
    text: "Depuis l'installation de SOL!, ma facture d'électricité a chuté de 75%. Le service client est impeccable.",
    rating: 5,
  },
  {
    id: '2',
    name: 'Marie L. (Hôtelière)',
    text: "Plus de coupures pendant les dîners de nos clients. Un investissement rentabilisé en moins de 3 ans.",
    rating: 5,
  },
];
