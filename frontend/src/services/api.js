import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wyb_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback seed data in case backend is loading or unavailable
export const FALLBACK_SERIES = [
  {
    id: 1,
    title: 'SERIES 01 – THE GENTLE ARMOR™',
    slug: 'series-01-the-gentle-armor',
    tagline: 'Armor is not forged from iron alone. It is woven from intention, memory, and silence.',
    description: 'An inaugural narrative collection examining the quiet resilience of everyday survival. Crafted with heavyweight Japanese drape fabrics and architectural proportions, Series 01 redefines modern garments as intimate shields against modern vulnerability.',
    cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
    status: 'published',
  },
];

export const FALLBACK_CHAPTERS = [
  {
    id: 1,
    series_id: 1,
    chapter_number: 1,
    title: 'CHAPTER 01 – THE BEGINNING',
    slug: 'chapter-01-the-beginning',
    subtitle: 'The Genesis of Vulnerability',
    description: 'Before strength can be built, vulnerability must be acknowledged. A study in raw canvas, drop-shoulder silhouettes, and unyielding intention.',
    content: `In the quiet before dawn, we assemble the pieces of who we intend to be.

The Beginning is not marked by fanfare or spectacle. It arrives in the quiet breath before the first step into the unknown. It is the realization that armor is not meant to hide who you are, but to preserve the sacred center while you fight battles nobody else can see.

Every stitch in this chapter was constructed around the philosophy of protective volume: generous chest room, dropped shoulder seamlines that contour naturally without rigidity, and a bespoke French terry weave that holds structural form while breathing like second skin.

We wear our scars not as apologies, but as medals of perseverance.`,
    cover_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    design_philosophy: 'Heavyweight organic cotton drape engineered to offer spatial protection without restriction. A boxy silhouette that creates a serene personal territory for the wearer.',
    status: 'published',
    related_product: {
      id: 1,
      name: 'THE GENTLE ARMOR – OVERSIZED TEE',
      slug: 'the-gentle-armor-oversized-tee',
      price: 1999,
      cover_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    id: 2,
    series_id: 1,
    chapter_number: 2,
    title: 'CHAPTER 02 – SILENT STRENGTH',
    slug: 'chapter-02-silent-strength',
    subtitle: 'The Power of Stillness',
    description: 'True resilience does not need to roar. It endures in silence, composed in charcoal gradients and disciplined lines.',
    content: `Silence is not absence; it is concentrated presence.

Chapter 02 investigates the discipline of restraint. Where noise demands attention, quiet command earns reverence. The garments here speak through subtle geometric cuts, concealed seam pockets, and tactile contrasts between matte and brushed textures.

When chaos swirls outside, the body requires an emotional sanctuary. This silhouette grounds the posture, balancing weight evenly through tailored drapes that cascade without unnecessary embellishment.`,
    cover_image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop',
    design_philosophy: 'Monochrome discipline meets fluid motion. Garments that absorb light rather than reflect it, producing an aura of understated resolve.',
    status: 'published',
    related_product: {
      id: 1,
      name: 'THE GENTLE ARMOR – OVERSIZED TEE',
      slug: 'the-gentle-armor-oversized-tee',
      price: 1999,
      cover_image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    id: 3,
    series_id: 1,
    chapter_number: 3,
    title: 'CHAPTER 03 – THE WEIGHT WE CARRY',
    slug: 'chapter-03-the-weight-we-carry',
    subtitle: 'Bearing Burden with Grace',
    description: 'Every individual carries invisible weights. Garments engineered to shoulder the burden with structured grace.',
    content: `What does a burden look like when you no longer run from it?

Chapter 03 confronts the heavy loads we shoulder in our careers, relationships, and private thoughts. Rather than masking the strain, we engineered garments that honor weight through density. 

Employing dense 380 GSM textiles, reinforced shoulder bands, and dual-layer hems, this chapter physically reflects how weight, when distributed properly, turns into anchoring stability.`,
    cover_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1200&auto=format&fit=crop',
    design_philosophy: 'High-density knit construction that provides structural containment and tactile reassurance through every demanding day.',
    status: 'published',
    related_product: {
      id: 1,
      name: 'THE GENTLE ARMOR – OVERSIZED TEE',
      slug: 'the-gentle-armor-oversized-tee',
      price: 1999,
      cover_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    id: 4,
    series_id: 1,
    chapter_number: 4,
    title: 'CHAPTER 04 – FINDING BALANCE',
    slug: 'chapter-04-finding-balance',
    subtitle: 'Equilibrium in Motion',
    description: 'Harmonizing masculine structure and feminine fluidity. Asymmetry that reveals beauty in imperfection.',
    content: `Equilibrium is not static; it is an ongoing dance of micro-adjustments.

In Chapter 04, we explore asymmetric hemlines, offset button closures, and split seam details. Perfection is an illusion; harmony is reality. By accepting the shifting tides of daily life, the wearer moves effortlessly between high-pressure environments and quiet moments of reflection.`,
    cover_image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    design_philosophy: 'Tension and release. Asymmetric drape lines that celebrate non-conformity while preserving timeless elegance.',
    status: 'published',
    related_product: {
      id: 1,
      name: 'THE GENTLE ARMOR – OVERSIZED TEE',
      slug: 'the-gentle-armor-oversized-tee',
      price: 1999,
      cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    id: 5,
    series_id: 1,
    chapter_number: 5,
    title: 'CHAPTER 05 – BECOMING WHOLE',
    slug: 'chapter-05-becoming-whole',
    subtitle: 'The Convergence of Trials',
    description: 'The culmination of all trials. Every scar integrated into an elevated, unified identity of modern grace.',
    content: `You do not become whole by erasing the past. You become whole by wearing it.

The final chapter of Series 01 marks the synthesis of every trial endured. Here, all signature construction motifs converge: the protective oversized collar, the raw-edged blind stitch, and the deep obsidian dyeing process.

To wear your battles is to realize you survived them all. You stand complete.`,
    cover_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    secondary_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    design_philosophy: 'Total integration. Ultra-matte finishes with architectural precision, concluding the narrative arc with quiet triumph.',
    status: 'published',
    related_product: {
      id: 1,
      name: 'THE GENTLE ARMOR – OVERSIZED TEE',
      slug: 'the-gentle-armor-oversized-tee',
      price: 1999,
      cover_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    },
  },
];

export const FALLBACK_PRODUCT = {
  id: 1,
  chapter_id: 1,
  name: 'THE GENTLE ARMOR – OVERSIZED TEE',
  slug: 'the-gentle-armor-oversized-tee',
  tagline: 'Subtle weight. Architectural drape. Your daily shield.',
  description: 'An uncompromising oversized silhouette cut from our proprietary 320 GSM French terry cotton. Featuring dropped shoulders, a reinforced 1.25" rib collar that retains shape perpetually, and blind-stitched hems for a seamless, floating profile. Designed to serve as an emotional sanctuary and tangible armor for the modern world.',
  details: `• Proprietary 320 GSM compact loopback French terry
• Architectural dropped-shoulder cut with generous boxy drape
• High-density tonal embroidery of brand motto on inner collar
• Pre-shrunk and silicone-washed for broken-in softness from day one
• Handcrafted in limited artisanal batches`,
  composition: '100% Combed Heavyweight Organic Cotton (320 GSM)',
  care_instructions: 'Machine wash cold inside-out on delicate cycle. Lay flat to dry away from direct sunlight. Cool iron if desired. Do not bleach or dry clean.',
  price: 1999.00,
  stock: 75,
  status: 'published',
  images: [
    {
      id: 1,
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
      caption: 'Front Studio View - Deep Obsidian',
      is_primary: 1,
    },
    {
      id: 2,
      image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop',
      caption: 'Back Silhouette View - Dropped shoulder drape',
      is_primary: 0,
    },
    {
      id: 3,
      image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      caption: 'Editorial Lookbook - Architectural Light',
      is_primary: 0,
    },
    {
      id: 4,
      image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      caption: 'Fabric Macro - 320 GSM French Terry Loopback',
      is_primary: 0,
    },
  ],
  sizes: [
    { id: 1, size: 'XS', stock: 8 },
    { id: 2, size: 'S', stock: 14 },
    { id: 3, size: 'M', stock: 22 },
    { id: 4, size: 'L', stock: 16 },
    { id: 5, size: 'XL', stock: 10 },
    { id: 6, size: 'XXL', stock: 5 },
  ],
  chapter: {
    id: 1,
    title: 'CHAPTER 01 – THE BEGINNING',
    slug: 'chapter-01-the-beginning',
  },
};

export default api;
