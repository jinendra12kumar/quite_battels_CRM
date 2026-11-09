import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Mail, Globe } from 'lucide-react';

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#171717] border-t border-[#F3EFE7]/10 text-[#77736C] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#F3EFE7]/10">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-brand text-2xl sm:text-3xl tracking-[0.25em] text-[#F3EFE7] uppercase">
              QUIET BATTLES™
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B49A70] font-medium">
              WEAR YOUR BATTLES.
            </p>
            <p className="text-sm font-light text-[#A1A1A6] max-w-md leading-relaxed">
              We construct psychological and physical armor for the modern nomad.
              Garments forged from silence, heavyweight Japanese textiles, and the unyielding beauty of personal resilience.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F3EFE7] mb-3 block">
              SUBSCRIBE TO DISPATCHES & PRIVATE DROPS
            </span>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center border-b border-[#F3EFE7]/20 pb-2 focus-within:border-[#B49A70] transition-colors">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent text-sm text-[#F3EFE7] placeholder-[#77736C] w-full focus:outline-none tracking-wider"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="text-[#F3EFE7] hover:text-[#B49A70] transition-colors pl-3 flex items-center space-x-1 uppercase text-xs tracking-widest cursor-pointer"
              >
                <span>JOIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[11px] text-[#77736C] mt-2">
              Receive private invitations to seasonal chapters, limited physical pieces, and design essays.
            </p>
          </div>
        </div>

        {/* Navigation & Details Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 text-xs tracking-[0.2em] uppercase">
          {/* Col 1: Explore */}
          <div className="space-y-4">
            <h4 className="text-[#F3EFE7] font-medium tracking-[0.25em]">ARCHIVE</h4>
            <ul className="space-y-3 text-[#77736C]">
              <li>
                <Link to="/archive" className="hover:text-[#F3EFE7] transition-colors">
                  SERIES 01 // OVERVIEW
                </Link>
              </li>
              <li>
                <Link to="/chapters/chapter-01-the-beginning" className="hover:text-[#F3EFE7] transition-colors">
                  CH. 01 – THE BEGINNING
                </Link>
              </li>
              <li>
                <Link to="/chapters/chapter-02-silent-strength" className="hover:text-[#F3EFE7] transition-colors">
                  CH. 02 – SILENT STRENGTH
                </Link>
              </li>
              <li>
                <Link to="/chapters/chapter-03-the-weight-we-carry" className="hover:text-[#F3EFE7] transition-colors">
                  CH. 03 – THE WEIGHT WE CARRY
                </Link>
              </li>
              <li>
                <Link to="/chapters/chapter-04-finding-balance" className="hover:text-[#F3EFE7] transition-colors">
                  CH. 04 – FINDING BALANCE
                </Link>
              </li>
              <li>
                <Link to="/chapters/chapter-05-becoming-whole" className="hover:text-[#F3EFE7] transition-colors">
                  CH. 05 – BECOMING WHOLE
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Brand */}
          <div className="space-y-4">
            <h4 className="text-[#F3EFE7] font-medium tracking-[0.25em]">THE MAISON</h4>
            <ul className="space-y-3 text-[#77736C]">
              <li>
                <Link to="/about" className="hover:text-[#F3EFE7] transition-colors">
                  PHILOSOPHY
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F3EFE7] transition-colors">
                  SHOP ALL PIECES
                </Link>
              </li>
              <li>
                <span className="text-[#77736C]">ATELIER CRAFT</span>
              </li>
              <li>
                <span className="text-[#77736C]">SUSTAINABILITY MANIFESTO</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance & Contact */}
          <div className="space-y-4">
            <h4 className="text-[#F3EFE7] font-medium tracking-[0.25em]">CONCIERGE</h4>
            <ul className="space-y-3 text-[#77736C]">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#B49A70]" />
                <a href="mailto:concierge@quietbattles.com" className="hover:text-[#F3EFE7] transition-colors normal-case">
                  concierge@quietbattles.com
                </a>
              </li>
              <li>
                <span className="text-[#77736C]">SHIPPING & GLOBAL CUSTOMS</span>
              </li>
              <li>
                <span className="text-[#77736C]">SIZE & PROPORTION GUIDE</span>
              </li>
              <li>
                <span className="text-[#77736C]">RETURNS & ARCHIVE EXCHANGES</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Creative Director / Admin */}
          <div className="space-y-4">
            <h4 className="text-[#F3EFE7] font-medium tracking-[0.25em]">AUTHENTICITY</h4>
            <p className="text-[11px] normal-case text-[#77736C] leading-relaxed">
              Every garment in Series 01 carries an individualized woven serial number verifying provenance and limited batch allocation.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center space-x-2 text-[10px] text-[#77736C] hover:text-[#B49A70] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#B49A70]" />
                <span>ADMINISTRATOR CMS</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-[#F3EFE7]/10 hover:border-[#B49A70] text-[#F3EFE7] hover:text-[#B49A70] rounded-full transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Global"
                className="p-2 border border-[#F3EFE7]/10 hover:border-[#B49A70] text-[#F3EFE7] hover:text-[#B49A70] rounded-full transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F3EFE7]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#77736C] space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} QUIET BATTLES™. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6 tracking-wider">
            <span className="hover:text-[#F3EFE7] cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-[#F3EFE7] cursor-pointer">TERMS OF SERVICE</span>
            <span className="hover:text-[#F3EFE7] cursor-pointer">EDITORIAL ETHICS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
