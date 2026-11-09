import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#F3EFE7] text-[#171717] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-24">
          <span className="text-xs uppercase tracking-[0.4em] text-[#B49A70] font-semibold">
            THE FOUNDATION
          </span>
          <h1 className="font-brand text-4xl sm:text-6xl text-[#171717] uppercase tracking-[0.2em] font-bold">
            QUIET BATTLES™
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-[#171717]/80 font-light leading-relaxed">
            "We do not design clothes for spectators. We engineer armor for those who live on the front lines of their own lives."
          </p>
          <p className="text-xs tracking-[0.35em] text-[#B49A70] uppercase font-mono font-medium">
            WEAR YOUR BATTLES.
          </p>
        </div>

        {/* Hero Image */}
        <div className="aspect-[21/9] w-full overflow-hidden border border-[#D8D0C3] mb-24 bg-[#171717] shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            alt="Atelier Workshop"
            className="w-full h-full object-cover filter brightness-[0.75]"
          />
        </div>

        {/* The Three Pillars (Cards in #E8E1D6) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28 border-y border-[#D8D0C3] py-20">
          <div className="p-8 bg-[#E8E1D6] border border-[#D8D0C3] space-y-4 shadow-sm">
            <span className="text-xs font-mono text-[#B49A70] font-bold">01 // PURPOSE</span>
            <h3 className="font-serif text-2xl text-[#171717]">Vulnerability Reimagined</h3>
            <p className="text-sm text-[#77736C] font-light leading-relaxed">
              Modern life demands constant performance. In response, our garments offer deliberate spatial volume—an intimate refuge where you are grounded, unhurried, and shielded from superficial noise.
            </p>
          </div>

          <div className="p-8 bg-[#E8E1D6] border border-[#D8D0C3] space-y-4 shadow-sm">
            <span className="text-xs font-mono text-[#B49A70] font-bold">02 // ATELIER</span>
            <h3 className="font-serif text-2xl text-[#171717]">Architectural Weight</h3>
            <p className="text-sm text-[#77736C] font-light leading-relaxed">
              We exclusively use dense 320–380 GSM combed organic cottons and Japanese drapes. This density provides physical presence, allowing the garment to fall with crisp architectural integrity rather than cling.
            </p>
          </div>

          <div className="p-8 bg-[#E8E1D6] border border-[#D8D0C3] space-y-4 shadow-sm">
            <span className="text-xs font-mono text-[#B49A70] font-bold">03 // CHRONOLOGY</span>
            <h3 className="font-serif text-2xl text-[#171717]">Episodic Narratives</h3>
            <p className="text-sm text-[#77736C] font-light leading-relaxed">
              Instead of ephemeral seasons, we construct chronological series. Series 01—The Gentle Armor™—consists of five transformative chapters exploring the quiet journey from raw origin to unified strength.
            </p>
          </div>
        </div>

        {/* The Motto & CTA (Visual Rhythm: Cinematic Dark Card #171717 / #222222) */}
        <div className="bg-[#171717] border border-[#171717] p-10 sm:p-16 text-center max-w-4xl mx-auto space-y-8 text-[#F3EFE7] shadow-xl">
          <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] font-semibold">
            THE ATELIER CREED
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl text-[#F3EFE7] uppercase tracking-[0.2em]">
            THE BATTLE IS WITHIN. THE ARMOR IS YOURS.
          </h2>
          <p className="text-sm text-[#F3EFE7]/70 font-light max-w-xl mx-auto">
            Explore the inaugural collection and begin your passage through Series 01 – The Gentle Armor™.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/archive"
              className="px-8 py-4 bg-[#F3EFE7] text-[#171717] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#B49A70] transition-colors inline-flex items-center space-x-2"
            >
              <span>EXPLORE THE ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="px-8 py-4 border border-[#F3EFE7]/25 text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] text-xs uppercase tracking-[0.25em] transition-colors"
            >
              SHOP PIECES
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
