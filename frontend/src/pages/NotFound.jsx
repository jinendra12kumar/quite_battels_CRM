import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F3EFE7] text-[#171717] flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md bg-[#E8E1D6] p-10 border border-[#D8D0C3] shadow-sm">
        <span className="text-xs uppercase tracking-[0.4em] text-[#B49A70] font-semibold">
          ERROR 404
        </span>
        <h1 className="font-brand text-3xl sm:text-4xl text-[#171717] uppercase tracking-[0.2em] font-bold">
          ARCHIVE NOT FOUND
        </h1>
        <p className="text-sm text-[#77736C] font-light">
          The requested series, chapter, or artifact does not exist within the current atelier timeline.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO MAISON</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
