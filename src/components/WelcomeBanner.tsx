import React from 'react';
import { ShieldCheck, Info, Sparkles, HelpCircle } from 'lucide-react';

export default function WelcomeBanner() {
  return (
    <div id="welcome-banner" className="bg-[#FCFAF2] border-[3px] border-[#191919] p-6 mb-8 relative shadow-[6px_6px_0px_0px_rgba(25,25,25,1)]">
      
      {/* Absolute floating stamp - top-right Japanese-style red block badge */}
      <div className="absolute -top-3.5 right-6 bg-[#D9383A] text-white text-[10px] font-bold tracking-widest px-3 py-1 border-2 border-[#191919] uppercase">
        倫理 // ETHICS FIRST
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Editorial Cinnabar Red Stamp Circle */}
        <div className="md:w-1/4 flex flex-col justify-center items-center py-4 border-b-2 border-dashed border-[#191919]/30 md:border-b-0 md:border-r-2 md:pr-6 shrink-0 text-center">
          <div className="w-20 h-20 rounded-full border-[4px] border-[#D9383A] flex flex-col items-center justify-center text-[#D9383A] select-none font-black tracking-tight leading-none rotate-[-6deg] hover:rotate-0 transition-transform cursor-help shadow-sm">
            <span className="text-[10px] uppercase tracking-wider font-semibold">APPROVED</span>
            <span className="text-sm font-black tracking-widest mt-0.5">誠実</span>
            <span className="text-[8px] uppercase tracking-wider font-semibold">INTEGRITY</span>
          </div>
          <div className="mt-3">
            <span className="text-[9px] uppercase font-mono bg-[#191919] text-white px-2 py-0.5 tracking-wider">
              SPEC NO. 042-A
            </span>
          </div>
        </div>

        {/* Right Side: Primary Content details */}
        <div className="flex-1 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#D9383A] tracking-widest block uppercase">
              // DESIGN SYSTEM & TIMELINE ENGINE
            </span>
            <h2 className="text-xl font-extrabold text-[#191919] tracking-tight mt-0.5 uppercase flex flex-wrap items-center gap-2" id="banner-title">
              Git Activity Pattern Customizer
            </h2>
            <p className="text-slate-700 text-xs mt-2 leading-relaxed">
              Unlock complete control over your commit graph aesthetics. This platform models a pristine Python CLI pipeline 
              designed around the Japanese minimalist visual tradition. Instantly paint custom heatmaps, simulate holiday periods, 
              and schedule organic code surges using human-like jitter models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-[#191919] text-xs">
            {/* Grid 1 */}
            <div className="space-y-1.5">
              <span className="font-bold text-[#191919] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <span className="w-1.5 h-3 bg-[#D9383A] inline-block" />
                Commit Architecture:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                <li>Platforms log squares purely by checking the <strong className="text-[#191919]">Git Author Date</strong> header.</li>
                <li>Ensure simulated email matches your primary GitHub email.</li>
                <li>Commits must belong to the repository's primary default branch to be tracked.</li>
              </ul>
            </div>
            
            {/* Grid 2 */}
            <div className="space-y-1.5">
              <span className="font-bold text-[#D9383A] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <span className="w-1.5 h-3 bg-[#191919] inline-block" />
                Strict Educational Intend:
              </span>
              <p className="text-slate-700 leading-relaxed bg-[#D9383A]/5 p-2 border border-[#D9383A]/20">
                This utility is strictly designed for simulation modeling, research, and API visualization. 
                Using fake backdates to deceive stakeholders or employers undermines the spirit of software development. 
                Expertise is measured in robust, clean software, never in artificial grid activity blocks.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
