import React, { useState } from 'react';
import { GeneratorConfig } from '../types';
import { Sliders, Settings, HelpCircle, Database, ChevronDown, ChevronUp, Star, Award, Pocket } from 'lucide-react';

interface ControlPanelProps {
  config: GeneratorConfig;
  onChange: (updates: Partial<GeneratorConfig>) => void;
}

export default function ControlPanel({ config, onChange }: ControlPanelProps) {
  const [showMetadata, setShowMetadata] = useState(false);

  const presets = [
    { id: 'custom', name: 'CUSTOM MOD', desc: 'Symmetrical DIY coordinates' },
    { id: 'waves', name: 'WAVE FLOW', desc: 'Sine wave structural pulses' },
    { id: 'busy', name: 'CRUNCH DEV', desc: 'Continuous 95% throughput commits' },
    { id: 'sparse', name: 'CASUAL SPA', desc: 'Relaxed scattered updates' },
    { id: 'weekends-only', name: 'WEEKEND WAR', desc: 'Intensive Sat & Sun log sweeps' },
  ];

  const handlePresetSelect = (presetId: string) => {
    const updates: Partial<GeneratorConfig> = { preset: presetId };
    
    if (presetId === 'busy') {
      updates.commitDensity = 0.95;
      updates.maxCommitsPerDay = 8;
      updates.skipWeekends = false;
    } else if (presetId === 'sparse') {
      updates.commitDensity = 0.22;
      updates.maxCommitsPerDay = 2;
    } else if (presetId === 'weekends-only') {
      updates.skipWeekends = false;
      updates.commitDensity = 0.45;
    } else if (presetId === 'waves') {
      updates.commitDensity = 0.6;
    }
    
    onChange(updates);
  };

  const peakDaysList = [
    { value: -1, label: 'NONE' },
    { value: 1, label: 'MON' },
    { value: 2, label: 'TUE' },
    { value: 3, label: 'WED' },
    { value: 4, label: 'THU' },
    { value: 5, label: 'FRI' },
  ];

  return (
    <div id="control-panel" className="bg-[#FCFAF2] border-[3px] border-[#191919] p-6 shadow-[5px_5px_0px_0px_rgba(25,25,25,1)] text-[#191919] relative">
      
      {/* Editorial minimal header stamp */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b-2 border-[#191919]">
        <Sliders className="h-5 w-5 text-[#D9383A]" />
        <h3 className="text-md font-black tracking-tight uppercase">Configuration Desk</h3>
        <span className="ml-auto font-mono text-[9px] bg-[#191919] text-[#FCFAF2] px-2 py-0.5 tracking-wider font-extrabold uppercase">
          SYS // PARAMS
        </span>
      </div>

      {/* Stylized Preset Selection ticket tape */}
      <div className="mb-6">
        <label className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-500 block mb-2">
          - SELECT SIGNAL TEMPLATE (PRESETS)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {presets.map((preset) => (
            <button
              id={`preset-btn-${preset.id}`}
              type="button"
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`p-2.5 border-2 text-left transition-all cursor-pointer ${
                config.preset === preset.id
                  ? 'bg-[#191919] text-[#FCFAF2] border-[#191919] font-black'
                  : 'bg-white text-[#191919] border-[#191919] hover:bg-[#FAF7F2] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] active:translate-x-0.5 active:shadow-none'
              }`}
            >
              <span className="font-extrabold text-[11px] block tracking-tight">{preset.name}</span>
              <span className="text-[8px] opacity-75 block truncate mt-0.5">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Core parameter Sliders */}
      <div className="space-y-6">
        
        {/* Max Commits Option */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1 font-bold">
            <span className="uppercase tracking-wider">01. Max Commits Per Active Day</span>
            <span className="text-[#D9383A] font-mono font-black border-b-[2px] border-[#D9383A]" id="lbl-max-commits">
              {config.maxCommitsPerDay} COMMITS
            </span>
          </div>
          <input
            id="slider-max-commits"
            type="range"
            min="1"
            max="25"
            value={config.maxCommitsPerDay}
            disabled={config.preset !== 'custom'}
            onChange={(e) => onChange({ maxCommitsPerDay: parseInt(e.target.value), preset: 'custom' })}
            className={`w-full accent-[#D9383A] h-1.5 cursor-pointer bg-slate-200 outline-none rounded ${
              config.preset !== 'custom' ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          />
          <p className="text-[9px] text-slate-500 font-medium mt-1">
            Specifies the highest ceiling on a single day. Commits vary randomly chronologically up to this value.
          </p>
        </div>

        {/* Base Density Option */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1 font-bold">
            <span className="uppercase tracking-wider">02. Base Commit Probability (Density)</span>
            <span className="text-blue-600 font-mono font-black border-b-[2px] border-blue-600" id="lbl-density">
              {Math.round(config.commitDensity * 100)}% LIKELIHOOD
            </span>
          </div>
          <input
            id="slider-density"
            type="range"
            min="5"
            max="100"
            step="5"
            value={Math.round(config.commitDensity * 100)}
            disabled={config.preset !== 'custom'}
            onChange={(e) => onChange({ commitDensity: parseFloat(e.target.value) / 100, preset: 'custom' })}
            className={`w-full accent-[#D9383A] h-1.5 cursor-pointer bg-slate-200 outline-none rounded ${
              config.preset !== 'custom' ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          />
          <p className="text-[9px] text-slate-500 font-medium mt-1">
            Likelihood percentage that any given day produces activity. Higher produces solid walls of color.
          </p>
        </div>

        {/* Days range block */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
              <span className="uppercase">Lookback (Past)</span>
              <span className="text-slate-700 font-mono font-black" id="lbl-days-back">
                -{config.daysBack}D
              </span>
            </div>
            <input
              id="slider-days-back"
              type="range"
              min="10"
              max="365"
              step="5"
              value={config.daysBack}
              onChange={(e) => onChange({ daysBack: parseInt(e.target.value) })}
              className="w-full accent-[#191919] h-1 bg-slate-200 cursor-pointer outline-none rounded"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
              <span className="uppercase">Ahead (Future)</span>
              <span className="text-slate-700 font-mono font-black" id="lbl-days-forward">
                +{config.daysForward}D
              </span>
            </div>
            <input
              id="slider-days-forward"
              type="range"
              min="0"
              max="90"
              step="5"
              value={config.daysForward}
              onChange={(e) => onChange({ daysForward: parseInt(e.target.value) })}
              className="w-full accent-[#191919] h-1 bg-slate-200 cursor-pointer outline-none rounded"
            />
          </div>
        </div>

        {/* NEW ADDITION: Vacation simulation weeks & Peak productivity day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-dashed border-[#191919]/20 pt-4">
          
          {/* Vacation Sim Slider */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1 font-bold">
              <span className="uppercase tracking-wide">Vacation Sandbox Block</span>
              <span className="text-[#D9383A] font-mono font-black" id="lbl-vacation">
                {config.vacationWeeks === 0 ? 'OFF' : `${config.vacationWeeks} WEEKS`}
              </span>
            </div>
            <input
              id="slider-vacation-weeks"
              type="range"
              min="0"
              max="8"
              step="1"
              value={config.vacationWeeks}
              onChange={(e) => onChange({ vacationWeeks: parseInt(e.target.value) })}
              className="w-full accent-amber-500 h-1 bg-slate-200 cursor-pointer outline-none rounded"
            />
            <span className="text-[8px] text-slate-500 block mt-0.5">
              Simulates going offline (consecutive blocks of zero commits) for high-fidelity realism.
            </span>
          </div>

          {/* Peak Productivity Day */}
          <div>
            <label className="text-[11px] uppercase tracking-wide font-bold block mb-1">
              Boosted Work Day (Peak)
            </label>
            <div className="grid grid-cols-6 gap-1">
              {peakDaysList.map((dayItem) => (
                <button
                  id={`btn-peak-${dayItem.value}`}
                  type="button"
                  key={dayItem.value}
                  onClick={() => onChange({ peakDay: dayItem.value })}
                  className={`text-[9px] py-1.5 font-bold border rounded uppercase transition-all cursor-pointer text-center ${
                    config.peakDay === dayItem.value
                      ? 'bg-[#10b981] text-white border-2 border-[#191919] font-black shadow-none'
                      : 'bg-white border-[#191919] text-[#1a1a1a] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {dayItem.label}
                </button>
              ))}
            </div>
            <span className="text-[8px] text-slate-500 block mt-1">
              Multiplies activity by 1.5x on this day of the week to mimic regular meeting sprints.
            </span>
          </div>

        </div>

        {/* Dynamic Commit message theme & Micro Jitter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* Commit messages style select */}
          <div className="bg-[#FCFAF2] p-3 border-2 border-[#191919]">
            <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1.5">
              Commit Message Style
            </label>
            <select
              id="select-message-theme"
              value={config.commitMsgLibrary}
              onChange={(e) => onChange({ commitMsgLibrary: e.target.value as any })}
              className="w-full text-xs font-bold px-2 py-1.5 bg-white border-2 border-[#191919] text-[#191919] focus:outline-none cursor-pointer"
            >
              <option value="architect">💼 Architect Bold</option>
              <option value="chaotic">🤦 Chaotic Slacker</option>
              <option value="corporate">🏢 Polite Enterprise</option>
              <option value="gitmoji">✨ Gitmoji-first</option>
            </select>
          </div>

          {/* Micro Jitter boolean switch */}
          <label className="flex items-center gap-2.5 p-3 bg-white border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer hover:bg-[#FAF7F2] transition-all text-xs" id="lbl-cb-jitter">
            <input
              id="cb-jitter-mode"
              type="checkbox"
              checked={config.jitterMode}
              onChange={(e) => onChange({ jitterMode: e.target.checked })}
              className="rounded accent-[#D9383A] h-4.5 w-4.5 cursor-pointer shrink-0"
            />
            <div>
              <span className="font-extrabold text-[#191919] block uppercase tracking-tight text-[10px]">Realistic Jitter Jitter</span>
              <span className="text-[8px] text-slate-500 font-medium block">Fluctuates daily energy sizes organically</span>
            </div>
          </label>

        </div>

        {/* Fast toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <label className="flex items-center gap-2.5 p-3 bg-white border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer hover:bg-[#FAF7F2] transition-all text-xs" id="lbl-cb-weekends">
            <input
              id="cb-skip-weekends"
              type="checkbox"
              checked={config.skipWeekends}
              disabled={config.preset === 'weekends-only'}
              onChange={(e) => onChange({ skipWeekends: e.target.checked })}
              className="rounded accent-[#D9383A] h-4.5 w-4.5 cursor-pointer shrink-0"
            />
            <div>
              <span className="font-extrabold text-[#191919] block uppercase tracking-tight text-[10px]">Omit Weekends</span>
              <span className="text-[8px] text-slate-500 font-medium block">Saturdays & Sundays empty</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-white border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer hover:bg-[#FAF7F2] transition-all text-xs" id="lbl-cb-random-time">
            <input
              id="cb-randomize-time"
              type="checkbox"
              checked={config.randomizeTime}
              onChange={(e) => onChange({ randomizeTime: e.target.checked })}
              className="rounded accent-[#D9383A] h-4.5 w-4.5 cursor-pointer shrink-0"
            />
            <div>
              <span className="font-extrabold text-[#191919] block uppercase tracking-tight text-[10px]">Rand Hourly Hours</span>
              <span className="text-[8px] text-slate-500 font-medium block">Vary clock times organically</span>
            </div>
          </label>

        </div>

        {/* Accordion dropdown metadata overrides */}
        <div className="border-t-2 border-[#191919] pt-4 mt-6">
          <button
            id="toggle-metadata-accordion"
            type="button"
            onClick={() => setShowMetadata(!showMetadata)}
            className="w-full flex justify-between items-center text-xs font-black text-slate-700 hover:text-black uppercase tracking-wider py-1 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#D9383A]" />
              03. Advanced Git Metadata overrides
            </span>
            {showMetadata ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showMetadata && (
            <div className="mt-4 space-y-4 pt-1 animate-fade-in text-xs" id="metadata-accordion-content">
              
              {/* Author and email credentials overrides */}
              <div className="space-y-3 p-3 bg-white border-2 border-[#191919]">
                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-500 block mb-1">
                    Simulate Commit User.Name Name
                  </label>
                  <input
                    id="input-author-name"
                    type="text"
                    placeholder="e.g. Satoshi Nakamoto"
                    value={config.authorName}
                    onChange={(e) => onChange({ authorName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FCFAF2] border-2 border-[#191919] text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-500 block mb-1">
                    Simulate Commit User.Email (Must Match Github Profile!)
                  </label>
                  <input
                    id="input-author-email"
                    type="email"
                    placeholder="e.g. satoshi@bitcoin.org"
                    value={config.authorEmail}
                    onChange={(e) => onChange({ authorEmail: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FCFAF2] border-2 border-[#191919] text-[#1a1a1a] focus:outline-none"
                  />
                  <span className="text-[9px] text-[#D9383A] font-bold block mt-1">
                    ⚠️ Required: Must be identical to your main GitHub account email so Github links squares!
                  </span>
                </div>
              </div>

              {/* Repo configs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-500 block mb-1">
                    Default Branch Rename
                  </label>
                  <input
                    id="input-branch-name"
                    type="text"
                    placeholder="main"
                    value={config.branchName}
                    onChange={(e) => onChange({ branchName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FCFAF2] border-2 border-[#191919] text-[#1a1a1a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-500 block mb-1">
                    Daily Logging Filename
                  </label>
                  <input
                    id="input-tracking-file"
                    type="text"
                    placeholder="contribution.txt"
                    value={config.trackingFile}
                    onChange={(e) => onChange({ trackingFile: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-[#FCFAF2] border-2 border-[#191919] text-[#1a1a1a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Message Header string */}
              <div>
                <label className="text-[9px] uppercase font-mono font-bold text-slate-500 block mb-1">
                  Fallback Commits Message Header
                </label>
                <input
                  id="input-commit-msg"
                  type="text"
                  placeholder="Refactor application interfaces"
                  value={config.commitMessage}
                  onChange={(e) => onChange({ commitMessage: e.target.value })}
                  className="w-full text-xs font-medium px-3 py-2 bg-[#FCFAF2] border-2 border-[#191919] text-[#1a1a1a] focus:outline-none"
                />
              </div>

              {/* Blank remote repository url */}
              <div className="p-3 bg-red-500/5 rounded border border-[#D9383A]/20">
                <label className="text-[9px] uppercase font-mono font-bold text-slate-500 block mb-1">
                  Blank Remote Github Repo URL (Optional Integration)
                </label>
                <input
                  id="input-remote-url"
                  type="url"
                  placeholder="https://github.com/linus/my-empty-sandbox-project.git"
                  value={config.remoteUrl}
                  onChange={(e) => onChange({ remoteUrl: e.target.value })}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border-2 border-[#191919] text-[#1a1a1a] focus:outline-none"
                />
                <span className="text-[8px] text-slate-500 block mt-1 leading-normal">
                  Providing this URL hooks up the repo's remote origin internally and prompts a direct sync query.
                </span>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
