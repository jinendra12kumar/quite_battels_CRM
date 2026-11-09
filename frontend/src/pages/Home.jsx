import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import api, { FALLBACK_SERIES, FALLBACK_CHAPTERS, FALLBACK_PRODUCT } from '../services/api';

export default function Home() {
  const [series, setSeries] = useState(FALLBACK_SERIES[0]);
  const [chapters, setChapters] = useState(FALLBACK_CHAPTERS);
  const [featuredProduct, setFeaturedProduct] = useState(FALLBACK_PRODUCT);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const seriesRes = await api.get('/series');
        if (seriesRes.data?.data?.length > 0) {
          setSeries(seriesRes.data.data[0]);
        }
      } catch (e) {
        // Fallback pre-set
      }

      try {
        const chaptersRes = await api.get('/chapters');
        if (chaptersRes.data?.data?.length > 0) {
          setChapters(chaptersRes.data.data);
        }
      } catch (e) {
        // Fallback pre-set
      }

      try {
        const prodRes = await api.get('/products');
        if (prodRes.data?.data?.length > 0) {
          setFeaturedProduct(prodRes.data.data[0]);
        }
      } catch (e) {
        // Fallback pre-set
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="bg-[#171717] text-[#F3EFE7] overflow-hidden">
      {/* 1. HERO SECTION (Cinematic Dark Hero) */}
      <section className="relative h-screen min-h-[680px] w-full flex items-center justify-center overflow-hidden bg-[#171717]">
        {/* Background Fashion Editorial Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            alt="Quiet Battles Hero Editorial"
            className="w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-[#171717]/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[#171717]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center space-x-3 text-[11px] uppercase tracking-[0.4em] text-[#B49A70] mb-6"
          >
            <span className="w-8 h-[1px] bg-[#B49A70]" />
            <span>QUIET BATTLES™ // INAUGURAL SERIES 01</span>
            <span className="w-8 h-[1px] bg-[#B49A70]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-brand text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.22em] text-[#F3EFE7] font-bold uppercase leading-tight"
          >
            WEAR YOUR BATTLES.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-[#F3EFE7]/80 font-light max-w-2xl font-serif italic tracking-wide leading-relaxed"
          >
            "Armor is not forged from iron alone. It is woven from intention, memory, and silence."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-5"
          >
            <Link
              to="/archive"
              className="px-8 py-4 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] hover:text-[#171717] text-xs font-semibold tracking-[0.3em] uppercase transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-3 group cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop"
              className="px-8 py-4 border border-[#F3EFE7]/25 text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] text-xs tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer"
            >
              ACQUIRE PIECES
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-[#77736C]"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#B49A70]">DESCEND</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#B49A70]" />
        </motion.div>
      </section>

      {/* 2. BRAND INTRODUCTION & PHILOSOPHY (Visual Rhythm: Clean Ivory Light Section) */}
      <section className="py-28 sm:py-36 bg-[#F3EFE7] text-[#171717] relative border-b border-[#D8D0C3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Narrative Text */}
            <div className="lg:col-span-7 space-y-8">
              <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] block font-semibold">
                ATELIER MANIFESTO
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171717] font-light leading-tight">
                Clothing as a psychological sanctuary against the chaos of the outside world.
              </h2>
              <div className="space-y-6 text-[#77736C] text-sm sm:text-base leading-relaxed font-light">
                <p>
                  Every day is an invisible skirmish. We navigate crowded streets, demanding boardrooms, and internal doubts with composure. We believe what you drape over your shoulders should not merely decorate; it should protect.
                </p>
                <p>
                  Rooted in Japanese architectural cuts, heavyweight organic weaves, and monochromatic restraint, <strong className="font-medium text-[#171717]">QUIET BATTLES™</strong> stands in resistance to fleeting trends. We make garments for those who fight quietly, endure patiently, and conquer deliberately.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#D8D0C3] text-xs tracking-[0.25em] uppercase text-[#77736C]">
                <div>
                  <span className="block font-brand text-2xl text-[#171717] font-bold mb-1">320+</span>
                  <span>GSM WEAVE WEIGHT</span>
                </div>
                <div>
                  <span className="block font-brand text-2xl text-[#171717] font-bold mb-1">05</span>
                  <span>EDITORIAL CHAPTERS</span>
                </div>
                <div>
                  <span className="block font-brand text-2xl text-[#171717] font-bold mb-1">100%</span>
                  <span>ORGANIC COTTON</span>
                </div>
              </div>
            </div>

            {/* Right Supporting Imagery (Asymmetric Card in #E8E1D6) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-[#D8D0C3] bg-[#E8E1D6] p-3 shadow-sm">
                <div className="w-full h-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
                    alt="Brand Philosophy Editorial"
                    className="w-full h-full object-cover editorial-image-hover"
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#F3EFE7]/95 backdrop-blur-md border border-[#D8D0C3]">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#B49A70] block mb-1 font-semibold">
                    STUDIO STUDY NO. 01
                  </span>
                  <p className="text-xs text-[#171717] font-serif italic">
                    "When the fabric holds weight, the mind discovers posture."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTION (Visual Rhythm: Cinematic Dark Section #171717 / #222222) */}
      <section className="py-24 bg-[#171717] text-[#F3EFE7] border-b border-[#F3EFE7]/10 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] block mb-2 font-medium">
                CORE CURATION
              </span>
              <h2 className="font-brand text-3xl sm:text-5xl tracking-[0.2em] text-[#F3EFE7] uppercase">
                {series.title}
              </h2>
            </div>
            <Link
              to="/archive"
              className="text-xs tracking-[0.25em] text-[#77736C] hover:text-[#B49A70] uppercase inline-flex items-center space-x-2 group transition-colors"
            >
              <span>VIEW FULL ARCHIVE CHRONOLOGY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Series Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#222222] border border-[#F3EFE7]/10 p-6 sm:p-10">
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden border border-[#F3EFE7]/10 bg-black">
              <img
                src={series.cover_image}
                alt={series.title}
                className="w-full h-full object-cover editorial-image-hover"
              />
            </div>

            <div className="lg:col-span-5 space-y-6 lg:pl-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#B49A70] border-b border-[#F3EFE7]/10 pb-2 block">
                SERIES OVERVIEW
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EFE7] font-normal leading-snug">
                {series.tagline}
              </h3>
              <p className="text-sm text-[#F3EFE7]/70 font-light leading-relaxed">
                {series.description}
              </p>

              <div className="space-y-3 pt-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#B49A70] block font-medium">
                  CONTAINS FIVE NARRATIVE CHAPTERS:
                </span>
                <ul className="text-xs text-[#F3EFE7]/80 space-y-2 font-mono">
                  {chapters.slice(0, 5).map((chap, i) => (
                    <li key={chap.id} className="flex items-center space-x-3">
                      <span className="text-[#B49A70] font-bold">0{i + 1}</span>
                      <span className="tracking-wider uppercase">{chap.title.replace('CHAPTER 0' + (i+1) + ' – ', '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Link
                  to="/archive"
                  className="px-8 py-3.5 bg-[#F3EFE7] text-[#171717] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#B49A70] transition-colors inline-flex items-center space-x-2"
                >
                  <span>EXPLORE SERIES</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHAPTER GLIMPSE (Visual Rhythm: Clean Ivory Light Section with #E8E1D6 Cards) */}
      <section className="py-28 bg-[#F3EFE7] text-[#171717] border-b border-[#D8D0C3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] font-semibold">
              CHRONOLOGICAL ESSAYS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light">
              Five Chapters. One Transformation.
            </h2>
            <p className="text-sm text-[#77736C] font-light">
              Each chapter represents a milestone of emotional armor, designed to be experienced sequentially.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {chapters.slice(0, 5).map((chap, index) => (
              <Link
                key={chap.id}
                to={`/chapters/${chap.slug}`}
                className="group flex flex-col bg-[#E8E1D6] border border-[#D8D0C3] hover:border-[#B49A70] transition-all duration-300 shadow-sm"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#171717]">
                  <img
                    src={chap.cover_image}
                    alt={chap.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#171717]/85 backdrop-blur-md text-[10px] tracking-widest text-[#B49A70] uppercase border border-[#B49A70]/30 font-semibold">
                    CH. 0{index + 1}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg text-[#171717] group-hover:text-[#B49A70] transition-colors leading-snug">
                      {chap.title.replace(/CHAPTER \d+ – /, '')}
                    </h3>
                    <p className="text-xs text-[#77736C] font-light line-clamp-2">
                      {chap.description}
                    </p>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#171717] font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>DISCOVER</span>
                    <ArrowRight className="w-3 h-3 text-[#B49A70]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL STORYTELLING SECTION (Visual Rhythm: Cinematic Dark Break #171717) */}
      <section className="relative py-36 bg-[#171717] text-[#F3EFE7] border-b border-[#F3EFE7]/10 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Editorial Texture"
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.4em] text-[#B49A70] font-semibold">
            THE SILENT ARMOR
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F3EFE7] font-light leading-tight">
            "We do not conquer by destroying what hurts us. We conquer by outlasting it in grace."
          </h2>
          <p className="text-sm sm:text-base text-[#F3EFE7]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Constructed in micro-runs with certified organic long-staple cotton. Each silhouette is tested across varied postures, climates, and emotional environments to provide an impenetrable sense of center.
          </p>
          <div className="pt-4">
            <Link
              to="/about"
              className="px-8 py-3.5 border border-[#B49A70] text-[#F3EFE7] text-xs uppercase tracking-[0.3em] hover:bg-[#B49A70] hover:text-[#171717] transition-all inline-block font-medium cursor-pointer"
            >
              READ OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FEATURED HERO PRODUCT SECTION (Visual Rhythm: Clean Ivory Light Section) */}
      <section className="py-28 bg-[#F3EFE7] text-[#171717]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#E8E1D6] border border-[#D8D0C3] p-8 sm:p-12 shadow-sm">
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/5] bg-[#171717] overflow-hidden border border-[#D8D0C3]">
                <img
                  src={featuredProduct.images?.[0]?.image_url || featuredProduct.cover_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop'}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover editorial-image-hover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-[#171717]/90 px-3 py-1 text-[10px] tracking-[0.25em] text-[#B49A70] uppercase border border-[#B49A70]/30 font-semibold">
                FEATURED ARTIFACT
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] font-semibold">
                ACQUISITION NO. 01
              </span>
              <h2 className="font-brand text-2xl sm:text-4xl text-[#171717] uppercase tracking-[0.18em]">
                {featuredProduct.name}
              </h2>
              <p className="text-2xl font-serif text-[#171717] tracking-wider font-semibold">
                ₹{Number(featuredProduct.price).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-[#77736C] font-light leading-relaxed">
                {featuredProduct.description}
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#77736C]">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B49A70]" />
                  <span>320 GSM French Terry Organic Cotton</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B49A70]" />
                  <span>Architectural drop-shoulder boxy silhouette</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B49A70]" />
                  <span>Available in sizes XS through XXL</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/products/${featuredProduct.slug}`}
                  className="px-8 py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.28em] font-medium transition-colors inline-flex items-center space-x-3 cursor-pointer"
                >
                  <span>INSPECT GARMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
