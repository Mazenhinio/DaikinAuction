import { Catalogue } from '@/types/events';

export const CATALOGUES: Catalogue[] = [
  { 
    slug: 'indoor', 
    title: 'Indoor Units', 
    fileUrl: '/catalogues/Indoor-Units-Exclusive-Discounted-Price-DAIKIN-New-Old-Stock.pdf', 
    imageUrl: '/images/Indoor Units.png',
    description: 'VRF indoor units & cassettes - Exclusive discounted price, new old stock' 
  },
  { 
    slug: 'outdoor', 
    title: 'Outdoor Units', 
    fileUrl: '/catalogues/Outdoor-Units-Exclusive-Discounted-Price-DAIKIN-New-Old-Stock (2).pdf', 
    imageUrl: '/images/Outdoor Units.png',
    description: 'VRF outdoor condensers - Exclusive discounted price, new old stock' 
  },
  { 
    slug: 'accessories', 
    title: 'Accessories', 
    fileUrl: '/catalogues/Accessories-Exclusive-Discounted-Price-DAIKIN-New-Old-Stock (1).pdf', 
    imageUrl: '/images/accessories.png',
    description: 'Controls, remotes, parts - Exclusive discounted price, new old stock' 
  },
  { 
    slug: 'split', 
    title: 'Split Units', 
    fileUrl: '/catalogues/Split-Units-Exclusive-Discounted-Price-DAIKIN-New-Old-Stock.pdf', 
    imageUrl: '/images/split systems.png',
    description: 'Split AC systems - Exclusive discounted price, new old stock' 
  },
  { 
    slug: 'spare', 
    title: 'Spare Parts', 
    fileUrl: '/catalogues/Spare-Parts-Exclusive-Discounted-Price-DAIKIN-New-Old-Stock (1).pdf', 
    imageUrl: '/images/spare parts.png',
    description: 'Genuine Daikin parts - Exclusive discounted price, new old stock' 
  },
  { 
    slug: 'bundles', 
    title: 'Equipment Bundles', 
    fileUrl: '', // No PDF download for bundles - special case
    imageUrl: '/images/Bundles.png',
    description: 'Create custom equipment combinations - Mix and match from our available stock' 
  },
];

export const bySlug = (slug: string) => CATALOGUES.find(c => c.slug === slug);
