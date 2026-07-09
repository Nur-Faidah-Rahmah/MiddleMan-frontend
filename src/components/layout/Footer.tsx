import React from 'react';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#131821] border-t border-rpg-board mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-slate-500" />
          <span className="font-serif font-bold text-lg text-slate-400">
            SIDEQUEST
          </span>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Sidequest. The realm's trusted micro-job board.
        </p>
        <div className="flex gap-4 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-rpg-gold transition-colors">Tavern Rules</a>
          <a href="#" className="hover:text-rpg-gold transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
