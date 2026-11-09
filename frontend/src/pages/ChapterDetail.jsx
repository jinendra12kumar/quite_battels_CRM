import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import api, { FALLBACK_CHAPTERS, FALLBACK_PRODUCT } from '../services/api';

export default function ChapterDetail() {
  const { slug } = useParams();
  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState(FALLBACK_CHAPTERS);
  const [relatedProduct, setRelatedProduct] = useState(FALLBACK_PRODUCT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const allRes = await api.get('/chapters');
        if (allRes.data?.data) {
          setAllChapters(allRes.data.data);
        }

        const res = await api.get(`/chapters/${slug}`);
        if (res.data?.data) {
          setChapter(res.data.data);
          if (res.data.data.related_product) {
            setRelatedProduct(res.data.data.related_product);
          }
        } else {
          const found = FALLBACK_CHAPTERS.find((c) => c.slug === slug);
          setChapter(found || FALLBACK_CHAPTERS[0]);
        }
      } catch (err) {
        const found = FALLBACK_CHAPTERS.find((c) => c.slug === slug);
        setChapter(found || FALLBACK_CHAPTERS[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (loading && !chapter) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center text-[#F3EFE7]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border border-[#B49A70] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#77736C]">Loading Chapter Story...</p>
        </div>
      </div>
    );
  }

  const currentChapter = chapter || FALLBACK_CHAPTERS[0];
  const currentIndex = allChapters.findIndex((c) => c.slug === currentChapter.slug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="bg-[#F3EFE7] text-[#171717]">
      {/* 1. CINEMATIC HERO SECTION (Dark Dramatic Banner #171717) */}
      <section className="relative w-full h-[75vh] min-h-[520px] overflow-hidden flex items-end bg-[#171717]">
        <div className="absolute inset-0">
          <img
            src={currentChapter.cover_image}
            alt={currentChapter.title}
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pb-16 w-full">
          <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.35em] text-[#B49A70] mb-4 font-semibold">
            <Link to="/archive" className="hover:text-[#F3EFE7] transition-colors flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>THE ARCHIVE</span>
            </Link>
            <span>/</span>
            <span>CHAPTER 0{currentChapter.chapter_number || currentIndex + 1}</span>
          </div>

          <h1 className="font-brand text-3xl sm:text-5xl md:text-6xl text-[#F3EFE7] font-bold uppercase tracking-[0.18em] leading-tight max-w-4xl">
            {currentChapter.title}
          </h1>

          {currentChapter.subtitle && (
            <p className="mt-3 text-lg sm:text-xl font-serif italic text-[#F3EFE7]/80 font-light">
              "{currentChapter.subtitle}"
            </p>
          )}
        </div>
      </section>

      {/* 2. CHAPTER STORYTELLING & ESSAY (Visual Rhythm: Clean Ivory Section) */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-20 pb-20">
        {/* Lead Quote */}
        <div className="border-l-2 border-[#B49A70] pl-6 py-2 mb-14 bg-[#E8E1D6]/40 p-4">
          <p className="font-serif text-2xl sm:text-3xl text-[#171717] font-light italic leading-relaxed">
            "{currentChapter.description}"
          </p>
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-8 text-[#171717]/90 font-light text-base sm:text-lg leading-relaxed">
          {currentChapter.content ? (
            currentChapter.content.split('\n\n').map((para, i) => (
              <p key={i} className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#B49A70] first-letter:font-bold first-letter:mr-1">
                {para}
              </p>
            ))
          ) : (
            <p>Every trial leaves an indelible impression on the spirit. In this chapter, we explore how cloth becomes memory.</p>
          )}
        </div>
      </section>

      {/* 3. MULTIPLE EDITORIAL IMAGE SECTIONS (In #E8E1D6 Ivory Tone Card) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Secondary Lookbook Image */}
          <div className="md:col-span-7 aspect-[4/5] overflow-hidden bg-[#171717] border border-[#D8D0C3] shadow-sm">
            <img
              src={currentChapter.secondary_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'}
              alt={`${currentChapter.title} Editorial Detail`}
              className="w-full h-full object-cover editorial-image-hover"
            />
          </div>

          {/* Design Philosophy Card */}
          <div className="md:col-span-5 space-y-8 p-6 sm:p-10 bg-[#E8E1D6] border border-[#D8D0C3] shadow-sm">
            <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.35em] uppercase text-[#B49A70] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DESIGN PHILOSOPHY</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal leading-snug">
              Constructed For Emotional Containment & Bodily Posture
            </h3>

            <p className="text-sm text-[#77736C] font-light leading-relaxed">
              {currentChapter.design_philosophy ||
                'Heavyweight organic cotton drape engineered to offer spatial protection without restriction. A boxy silhouette that creates a serene personal territory for the wearer.'}
            </p>

            <div className="border-t border-[#D8D0C3] pt-6 space-y-4 text-xs uppercase tracking-widest text-[#77736C]">
              <div className="flex justify-between">
                <span>SILHOUETTE</span>
                <span className="text-[#171717] font-medium">OVERSIZED DROP-SHOULDER</span>
              </div>
              <div className="flex justify-between">
                <span>FABRIC ORIGIN</span>
                <span className="text-[#171717] font-medium">CERTIFIED COMBED ORGANIC</span>
              </div>
              <div className="flex justify-between">
                <span>STITCHING</span>
                <span className="text-[#171717] font-medium">REINFORCED BLIND SEAM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RELATED PRODUCT SECTION & CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-20">
        <div className="border border-[#D8D0C3] bg-[#E8E1D6] p-8 sm:p-14 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 aspect-[4/5] bg-[#171717] overflow-hidden border border-[#D8D0C3]">
              <img
                src={relatedProduct.images?.[0]?.image_url || relatedProduct.cover_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop'}
                alt={relatedProduct.name}
                className="w-full h-full object-cover editorial-image-hover"
              />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-[#B49A70] font-semibold">
                <span>CHAPTER ARTIFACT</span>
                <span>•</span>
                <span>THE PHYSICAL INCARNATION</span>
              </div>

              <h2 className="font-brand text-2xl sm:text-4xl text-[#171717] uppercase tracking-[0.16em]">
                {relatedProduct.name}
              </h2>

              <p className="font-serif text-2xl text-[#171717] font-semibold">
                ₹{Number(relatedProduct.price).toLocaleString('en-IN')}
              </p>

              <p className="text-sm text-[#77736C] font-light leading-relaxed">
                {relatedProduct.description}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to={`/products/${relatedProduct.slug}`}
                  className="w-full sm:w-auto px-8 py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-colors inline-flex items-center justify-center space-x-3 text-center"
                >
                  <span>DISCOVER PRODUCT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 border border-[#171717]/30 text-[#171717] hover:border-[#171717] hover:bg-[#171717]/5 text-xs uppercase tracking-[0.25em] transition-colors text-center"
                >
                  VIEW ALL PIECES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEXT / PREVIOUS CHAPTER PAGINATION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 border-t border-[#D8D0C3] py-12">
        <div className="grid grid-cols-2 gap-6">
          <div>
            {prevChapter ? (
              <Link
                to={`/chapters/${prevChapter.slug}`}
                className="group flex flex-col space-y-1 hover:text-[#B49A70] transition-colors"
              >
                <div className="flex items-center space-x-1 text-xs text-[#77736C] uppercase tracking-widest group-hover:text-[#B49A70]">
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS CHAPTER</span>
                </div>
                <span className="font-serif text-lg sm:text-xl text-[#171717] group-hover:text-[#B49A70]">
                  {prevChapter.title}
                </span>
              </Link>
            ) : (
              <span className="text-xs text-[#77736C] uppercase tracking-widest">
                SERIES COMMENCEMENT
              </span>
            )}
          </div>

          <div className="text-right">
            {nextChapter ? (
              <Link
                to={`/chapters/${nextChapter.slug}`}
                className="group flex flex-col items-end space-y-1 hover:text-[#B49A70] transition-colors"
              >
                <div className="flex items-center space-x-1 text-xs text-[#77736C] uppercase tracking-widest group-hover:text-[#B49A70]">
                  <span>NEXT CHAPTER</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <span className="font-serif text-lg sm:text-xl text-[#171717] group-hover:text-[#B49A70]">
                  {nextChapter.title}
                </span>
              </Link>
            ) : (
              <span className="text-xs text-[#77736C] uppercase tracking-widest">
                SERIES CONCLUSION
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
