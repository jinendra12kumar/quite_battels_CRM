import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import api, { FALLBACK_SERIES, FALLBACK_CHAPTERS } from '../services/api';

export default function Archive() {
  const [seriesList, setSeriesList] = useState(FALLBACK_SERIES);
  const [chapters, setChapters] = useState(FALLBACK_CHAPTERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, cRes] = await Promise.allSettled([
          api.get('/series'),
          api.get('/chapters'),
        ]);

        if (sRes.status === 'fulfilled' && sRes.value.data?.data?.length > 0) {
          setSeriesList(sRes.value.data.data);
        }
        if (cRes.status === 'fulfilled' && cRes.value.data?.data?.length > 0) {
          setChapters(cRes.value.data.data);
        }
      } catch (err) {
        console.warn('Using fallback archive data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentSeries = seriesList[0] || FALLBACK_SERIES[0];

  return (
    <div className="bg-[#F3EFE7] text-[#171717] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Archive Breadcrumb & Header */}
        <div className="mb-12 border-b border-[#D8D0C3] pb-8">
          <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.3em] text-[#77736C] mb-4">
            <Link to="/" className="hover:text-[#171717] transition-colors">QUIET BATTLES™</Link>
            <span>/</span>
            <span className="text-[#B49A70] font-semibold">THE ARCHIVE</span>
          </div>
          <h1 className="font-brand text-4xl sm:text-6xl text-[#171717] font-bold uppercase tracking-[0.2em]">
            THE ARCHIVE
          </h1>
          <p className="mt-4 text-[#77736C] font-serif text-lg sm:text-xl max-w-3xl font-light italic">
            A permanent chronological library of all seasonal collections, design essays, and conceptual armor developed by the atelier.
          </p>
        </div>

        {/* Featured Series Hero Banner (Dark Editorial Card #171717 / #222222) */}
        <section className="relative mb-24 overflow-hidden border border-[#171717] bg-[#171717] text-[#F3EFE7] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden">
              <img
                src={currentSeries.cover_image}
                alt={currentSeries.title}
                className="w-full h-full object-cover editorial-image-hover"
              />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.35em] uppercase text-[#B49A70] border border-[#B49A70]/40 px-3 py-1 font-semibold">
                <span>INAUGURAL RELEASE</span>
              </div>
              <h2 className="font-brand text-3xl sm:text-4xl text-[#F3EFE7] uppercase tracking-[0.16em] leading-tight">
                {currentSeries.title}
              </h2>
              <p className="text-base font-serif italic text-[#F3EFE7]/80">
                "{currentSeries.tagline}"
              </p>
              <p className="text-sm text-[#F3EFE7]/70 font-light leading-relaxed">
                {currentSeries.description}
              </p>

              <div className="pt-4 border-t border-[#F3EFE7]/15 flex items-center justify-between text-xs tracking-widest text-[#B49A70]">
                <span>TOTAL CHAPTERS: 05</span>
                <span>STATUS: ARCHIVED & ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Five Chapter Cards Section (In #E8E1D6 Cards on #F3EFE7 Ivory Ground) */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-[#D8D0C3] pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B49A70] block font-semibold">
                NARRATIVE COMPILATION
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#171717] font-light">
                Chapters of The Gentle Armor™
              </h2>
            </div>
            <span className="text-xs font-mono text-[#77736C] hidden sm:block">
              SERIES 01 // 05 CHAPTERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="bg-[#E8E1D6] border border-[#D8D0C3] hover:border-[#B49A70] transition-all duration-300 flex flex-col group shadow-sm"
              >
                {/* Chapter Card Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#171717]">
                  <img
                    src={chapter.cover_image}
                    alt={chapter.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#171717]/85 backdrop-blur-sm px-3 py-1 text-[10px] tracking-[0.25em] text-[#B49A70] uppercase border border-[#B49A70]/30 font-semibold">
                    CHAPTER 0{index + 1}
                  </div>
                  {chapter.subtitle && (
                    <div className="absolute bottom-4 left-4 right-4 bg-[#171717]/80 backdrop-blur-sm p-2 text-[11px] font-serif italic text-[#F3EFE7]">
                      {chapter.subtitle}
                    </div>
                  )}
                </div>

                {/* Chapter Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-brand text-xl text-[#171717] group-hover:text-[#B49A70] transition-colors tracking-wider">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-[#77736C] font-light leading-relaxed line-clamp-3">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D8D0C3] flex items-center justify-between">
                    <Link
                      to={`/chapters/${chapter.slug}`}
                      className="text-xs uppercase tracking-[0.25em] text-[#171717] hover:text-[#B49A70] font-medium flex items-center space-x-2 transition-colors group-hover:translate-x-1"
                    >
                      <span>VIEW CHAPTER</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B49A70]" />
                    </Link>

                    <span className="text-[10px] text-[#77736C] font-mono">
                      0{index + 1} / 05
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
