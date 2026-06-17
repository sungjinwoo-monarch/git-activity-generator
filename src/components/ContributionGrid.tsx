import React, { useState, useRef, useEffect } from 'react';
import { DayActivity, GenerationStats } from '../types';
import { Paintbrush, Eraser, Sparkles, Flame, Grid, RotateCcw, Heart, Waves, FilePlus, Calendar } from 'lucide-react';

interface ContributionGridProps {
  activities: DayActivity[];
  stats: GenerationStats;
  onModifyDay?: (dateStr: string, newCount: number) => void;
  onResetManualOverrides?: () => void;
  onApplyPresetPattern?: (type: 'git' | 'sine' | 'heart' | 'chess') => void;
  hasManualOverrides: boolean;
}

export default function ContributionGrid({
  activities,
  stats,
  onModifyDay,
  onResetManualOverrides,
  onApplyPresetPattern,
  hasManualOverrides,
}: ContributionGridProps) {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [paintTool, setPaintTool] = useState<'draw' | 'erase'>('draw');
  
  // Dragging states to draw dynamically by dragging mouse!
  const [isMouseDown, setIsMouseDown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Group activities into weeks (approx 53 columns)
  const firstDay = activities[0]?.date || new Date();
  const firstDayOfWeek = firstDay.getDay(); // 0 is Sunday, 6 is Saturday

  const paddedActivities: (DayActivity | null)[] = Array(firstDayOfWeek).fill(null);
  paddedActivities.push(...activities);

  const columns: (DayActivity | null)[][] = [];
  let currentWeek: (DayActivity | null)[] = [];

  paddedActivities.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === paddedActivities.length - 1) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      columns.push(currentWeek);
      currentWeek = [];
    }
  });

  // Unique Japanese modern color selection palette
  const getCellColorClass = (count: number) => {
    if (count === 0) return 'bg-[#FAF8F5] hover:bg-[#EAE6DF] border border-[#E0DCD3]';
    if (count <= 2) return 'bg-[#B4D9B8] border border-[#8FBFA0] text-slate-800';
    if (count <= 5) return 'bg-[#73B07B] border border-[#528F5A] text-white';
    if (count <= 8) return 'bg-[#316938] border border-[#1F4C24] text-white';
    // Highlight Crimson Red (9+ commits)
    return 'bg-[#D9383A] border border-[#A82425] text-white animate-pulse';
  };

  const formatFriendlyDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMonthLabels = () => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = -1;

    columns.forEach((week, colIndex) => {
      const firstValidDay = week.find((day) => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) {
          const monthText = firstValidDay.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          if (labels.length === 0 || colIndex - labels[labels.length - 1].colIndex > 2) {
            labels.push({ text: monthText, colIndex });
            lastMonth = month;
          }
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  // Draw over a single element
  const handleCellPaint = (dayStr: string, currentCount: number) => {
    if (!onModifyDay) return;
    if (paintTool === 'erase') {
      onModifyDay(dayStr, 0);
    } else {
      // Draw standard count: set to 12 (highlight Red block) if empty, or increment
      let nextCount = 12;
      if (currentCount > 0) {
        nextCount = currentCount >= 12 ? 0 : currentCount + 3;
      }
      onModifyDay(dayStr, nextCount);
    }
  };

  const handleCellMouseEnter = (day: DayActivity) => {
    setHoveredDay(day);
    if (isMouseDown) {
      handleCellPaint(day.dateStr, day.commitCount);
    }
  };

  return (
    <div className="bg-[#FCFAF2] border-[3px] border-[#191919] p-6 shadow-[5px_5px_0px_0px_rgba(25,25,25,1)] text-[#191919] relative overflow-hidden" ref={containerRef}>
      
      {/* Decorative vertical stripe badge */}
      <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#D9383A] border-l-2 border-[#191919]" />
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between md:items-start border-b-2 border-[#191919] pb-4 mb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#D9383A] block uppercase font-bold">
            // INTERACTIVE GRAPHICS INTERFACE
          </span>
          <h3 className="text-md font-black tracking-tight text-[#191919] uppercase flex items-center gap-2">
            <Grid className="h-5 w-5 text-[#D9383A]" />
            Timeline Matrix Canvas
          </h3>
          <p className="text-slate-600 text-xs mt-0.5 max-w-lg">
            Drag mouse over squares to paint arbitrary pixel designs. The generated code compiles and outputs matching timestamps.
          </p>
        </div>

        {/* Clear manual controls */}
        {hasManualOverrides && onResetManualOverrides && (
          <button
            id="clear-grid-overrides"
            onClick={onResetManualOverrides}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white hover:bg-[#F2EFE9] border-2 border-[#191919] font-bold tracking-wider uppercase transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#D9383A]" />
            Clear Canvas
          </button>
        )}
      </div>

      {/* Graphic Design Toolbar: Brush state, Stamps block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 border-b-2 border-dashed border-[#191919]/30 pb-5">
        
        {/* Brush triggers (4 columns) */}
        <div className="md:col-span-5 space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider block">
            Paintbrush Toolbox
          </span>
          <div className="flex gap-2">
            <button
              id="tool-draw-btn"
              onClick={() => setPaintTool('draw')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase border-2 border-[#191919] tracking-wider transition-all cursor-pointer ${
                paintTool === 'draw'
                  ? 'bg-[#191919] text-[#FCFAF2] shadow-none'
                  : 'bg-white text-[#191919] hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]'
              }`}
            >
              <Paintbrush className="h-4 w-4" />
              Draw Ink
            </button>

            <button
              id="tool-erase-btn"
              onClick={() => setPaintTool('erase')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase border-2 border-[#191919] tracking-wider transition-all cursor-pointer ${
                paintTool === 'erase'
                  ? 'bg-[#191919] text-[#FCFAF2] shadow-none'
                  : 'bg-white text-[#191919] hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]'
              }`}
            >
              <Eraser className="h-4 w-4 text-[#D9383A]" />
              Eraser
            </button>
          </div>
        </div>

        {/* Art Stamps block (7 columns) */}
        {onApplyPresetPattern && (
          <div className="md:col-span-7 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider block">
              Inject Custom Graphic Stamp (Full Year Design)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                id="stamp-git-btn"
                onClick={() => onApplyPresetPattern('git')}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold border-2 border-[#191919] bg-white hover:bg-[#FAF7F2] tracking-wider uppercase transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer"
              >
                <Grid className="h-3.5 w-3.5 text-blue-500" />
                "GIT" text
              </button>

              <button
                id="stamp-heart-btn"
                onClick={() => onApplyPresetPattern('heart')}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold border-2 border-[#191919] bg-white hover:bg-[#FAF7F2] tracking-wider uppercase transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer"
              >
                <Heart className="h-3.5 w-3.5 text-[#D9383A]" />
                Heart shape
              </button>

              <button
                id="stamp-sine-btn"
                onClick={() => onApplyPresetPattern('sine')}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold border-2 border-[#191919] bg-white hover:bg-[#FAF7F2] tracking-wider uppercase transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer"
              >
                <Waves className="h-3.5 w-3.5 text-emerald-500" />
                Sine Wave
              </button>

              <button
                id="stamp-chess-btn"
                onClick={() => onApplyPresetPattern('chess')}
                className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-bold border-2 border-[#191919] bg-white hover:bg-[#FAF7F2] tracking-wider uppercase transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] cursor-pointer"
              >
                <Grid className="h-3.5 w-3.5 text-amber-500" />
                Checkers
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Grid wrapper scrollpane */}
      <div className="overflow-x-auto pb-4 select-none">
        <div className="min-w-[700px] relative">
          
          {/* Calendar Months line */}
          <div className="h-5 flex text-[10px] font-extrabold text-[#191919] mb-1 relative pl-8">
            {monthLabels.map((lbl, idx) => {
              const leftOffset = lbl.colIndex * (12 + 3);
              return (
                <div
                  key={idx}
                  className="absolute border-l-2 border-[#191919]/50 pl-1"
                  style={{ left: `${leftOffset + 32}px` }}
                >
                  {lbl.text}
                </div>
              );
            })}
          </div>

          {/* Core matrix of boxes */}
          <div className="flex gap-2 relative">
            
            {/* Weekdays Labels col */}
            <div className="flex flex-col justify-between text-[9px] text-slate-800 font-extrabold h-[105px] w-6 pt-1 select-none shrink-0 border-r border-slate-300 pr-1 text-right">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* Matrix of columns */}
            <div 
              className="flex gap-[3px] flex-grow"
              onMouseDown={() => setIsMouseDown(true)}
            >
              {columns.map((week, wkIdx) => (
                <div key={wkIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dyIdx) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${wkIdx}-${dyIdx}`}
                          className="w-[12px] h-[12px] bg-transparent"
                        />
                      );
                    }
                    
                    return (
                      <div
                        key={day.dateStr}
                        onMouseDown={() => {
                          setIsMouseDown(true);
                          handleCellPaint(day.dateStr, day.commitCount);
                        }}
                        onMouseEnter={() => handleCellMouseEnter(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-[13px] h-[13px] border transition-all duration-700 cursor-pointer ${getCellColorClass(
                          day.commitCount
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

          {/* Dynamic tooltip details readout overlay */}
          <div className="mt-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-t-2 border-[#191919] pt-4 select-none text-xs">
            <div className="text-[#191919] font-medium min-h-[20px]">
              {hoveredDay ? (
                <span className="flex items-center gap-2 text-[#191919]">
                  <span className={`w-3.5 h-3.5 border ${getCellColorClass(hoveredDay.commitCount)} shrink-0`} />
                  <span className="font-extrabold text-[#D9383A]">{hoveredDay.commitCount} COMMITS</span> 
                  on {formatFriendlyDate(hoveredDay.dateStr)}
                  {hoveredDay.isVacation && <span className="text-[10px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono uppercase">Vacation Block</span>}
                  {hoveredDay.isPeakDay && <span className="text-[10px] bg-emerald-100 text-[#1F4C24] px-1 py-0.2 rounded font-mono uppercase">Peak Day</span>}
                </span>
              ) : (
                <span className="text-[#191919] flex items-center gap-1.5 italic font-mono text-[11px]">
                  <span>[ DESIGNER TRACE HOVER READY ]</span>
                  <span className="animate-pulse">●</span>
                </span>
              )}
            </div>

            {/* Beautiful Graphic Palette Guide */}
            <div className="flex items-center gap-1.5 text-[#191919] text-[10px] font-bold font-mono">
              <span>MIN</span>
              <div className="w-3 h-3 border border-[#E0DCD3] bg-[#FAF8F5]" title="0 commits" />
              <div className="w-3 h-3 border border-[#8FBFA0] bg-[#B4D9B8]" title="1-2 commits" />
              <div className="w-3 h-3 border border-[#528F5A] bg-[#73B07B]" title="3-5 commits" />
              <div className="w-3 h-3 border border-[#1F4C24] bg-[#316938]" title="6-8 commits" />
              <div className="w-3 h-3 border border-[#A82425] bg-[#D9383A]" title="9+ commits (Crimson)" />
              <span>MAX</span>
            </div>
          </div>

        </div>
      </div>

      {/* Stats Quick strip - Large bold numeric indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t-2 border-dashed border-[#191919]/30">
        <div className="bg-white p-3 border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]">
          <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Generated Volume</span>
          <span className="text-2xl font-black text-[#D9383A]" id="stat-total-commits">
            {stats.totalCommits.toLocaleString()}
          </span>
          <span className="text-[9px] font-medium text-slate-400 block mt-0.5">commited logs</span>
        </div>

        <div className="bg-white p-3 border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]">
          <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Active Days Count</span>
          <span className="text-2xl font-black text-[#191919]" id="stat-active-days">
            {stats.activeDaysCount}
          </span>
          <span className="text-[9px] font-bold text-slate-500 block mt-0.5">/ {stats.totalDays} Total days</span>
        </div>

        <div className="bg-white p-3 border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]">
          <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Commit Density Rate</span>
          <span className="text-2xl font-black text-[#316938]" id="stat-active-percentage">
            {stats.activeDaysPercentage.toFixed(1)}%
          </span>
          <span className="text-[9px] font-medium text-slate-400 block mt-0.5">timeline intensity</span>
        </div>

        <div className="bg-white p-3 border-2 border-[#191919] shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]">
          <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Weekend Commits</span>
          <span className="text-2xl font-black text-rose-600" id="stat-weekend-commits">
            {stats.weekendCommits}
          </span>
          <span className="text-[9px] font-medium text-slate-400 block mt-0.5">saturday/sunday volume</span>
        </div>
      </div>

    </div>
  );
}
