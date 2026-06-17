import React, { useState, useMemo } from 'react';
import { GeneratorConfig, DayActivity } from './types';
import { 
  generateContributionData, 
  calculateStats, 
  generatePythonScript, 
  generateTestScript 
} from './utils';
import WelcomeBanner from './components/WelcomeBanner';
import ContributionGrid from './components/ContributionGrid';
import ControlPanel from './components/ControlPanel';
import CodeViewer from './components/CodeViewer';
import { Github, FolderGit, FileCode2, Pocket, Flame, Heart, FileText } from 'lucide-react';

export default function App() {
  // Config state containing intuitive defaults with simulated realism parameters
  const [config, setConfig] = useState<GeneratorConfig>({
    maxCommitsPerDay: 5,
    commitDensity: 0.65,
    skipWeekends: false,
    daysBack: 365,
    daysForward: 0,
    remoteUrl: '',
    branchName: 'main',
    trackingFile: 'contribution.txt',
    commitMessage: 'Refactor architectural modules',
    authorName: '',
    authorEmail: '',
    randomizeTime: true,
    timeRangeStart: 9,
    timeRangeEnd: 21,
    preset: 'custom',
    commitMsgLibrary: 'gitmoji',
    vacationWeeks: 0,
    peakDay: -1,
    jitterMode: true,
  });

  // Manual paint edits state (dayStr -> commitCount)
  const [manualOverrides, setManualOverrides] = useState<Record<string, number>>({});

  // Single day count update action
  const handleModifyDay = (dateStr: string, newCount: number) => {
    setManualOverrides(prev => {
      const updated = { ...prev };
      if (newCount === 0) {
        delete updated[dateStr];
      } else {
        updated[dateStr] = newCount;
      }
      return updated;
    });
  };

  const handleResetManualOverrides = () => {
    setManualOverrides({});
  };

  // Generate activities with base simulations
  const baseActivities = useMemo(() => {
    return generateContributionData(config);
  }, [config]);

  // Inject stamp presets manually into overrides map
  const handleApplyPresetPattern = (patternType: 'git' | 'sine' | 'heart' | 'chess') => {
    const newOverrides: Record<string, number> = {};
    const firstDay = baseActivities[0]?.date || new Date();
    const firstDayOfWeek = firstDay.getDay();

    baseActivities.forEach((day, index) => {
      const cumulativeIndex = index + firstDayOfWeek;
      const col = Math.floor(cumulativeIndex / 7);
      const row = cumulativeIndex % 7;
      
      let count = 0;

      if (patternType === 'git') {
        const isG = (col === 14 && row >= 1 && row <= 5) ||
                    ((col >= 15 && col <= 17) && (row === 0 || row === 6)) ||
                    (col === 18 && (row === 0 || row === 3 || row === 4 || row === 6)) ||
                    (row === 3 && col >= 16 && col <= 18);
                    
        const isI = (col === 22 && row >= 0 && row <= 6) ||
                    ((col === 21 || col === 23) && (row === 0 || row === 6));
                    
        const isT = (row === 0 && col >= 25 && col <= 29) ||
                    (col === 27 && row >= 0 && row <= 6);

        if (isG || isI || isT) count = 12;
      } 
      else if (patternType === 'sine') {
        const amplitude = Math.round(2.5 * Math.sin(col / 3.5) + 3);
        if (row === amplitude) {
          count = 12; 
        } else if (Math.abs(row - amplitude) === 1) {
          count = 5;
        }
      } 
      else if (patternType === 'heart') {
        const relCol = col - 25; // Center on column 25 out of ~53
        let isH = false;
        
        if (row === 1) {
          isH = relCol === -2 || relCol === -1 || relCol === 1 || relCol === 2;
        } else if (row === 2) {
          isH = relCol >= -3 && relCol <= 3;
        } else if (row === 3) {
          isH = relCol >= -3 && relCol <= 3;
        } else if (row === 4) {
          isH = relCol >= -2 && relCol <= 2;
        } else if (row === 5) {
          isH = relCol >= -1 && relCol <= 1;
        } else if (row === 6) {
          isH = relCol === 0;
        }

        if (isH) count = 12; // Cinnabar Red
      } 
      else if (patternType === 'chess') {
        if ((col + row) % 2 === 0) {
          count = 8;
        }
      }

      if (count > 0) {
        newOverrides[day.dateStr] = count;
      }
    });

    setManualOverrides(newOverrides);
  };

  // Merge simulation calculations with manual overrides
  const activities = useMemo(() => {
    return baseActivities.map(day => {
      if (manualOverrides[day.dateStr] !== undefined) {
        return {
          ...day,
          commitCount: manualOverrides[day.dateStr],
        };
      }
      return day;
    });
  }, [baseActivities, manualOverrides]);

  // Compute stats on the resulting dataset
  const stats = useMemo(() => calculateStats(activities), [activities]);

  const hasManualOverrides = Object.keys(manualOverrides).length > 0;

  // Render standard Python CLI Script content dynamically
  const pythonScriptCode = useMemo(() => {
    return generatePythonScript(config);
  }, [config]);

  // Render Unit Test code
  const testScriptCode = useMemo(() => {
    return generateTestScript();
  }, []);

  const handleConfigChange = (updates: Partial<GeneratorConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919] font-sans antialiased relative pb-16" id="app-root">
      
      {/* Editorial aesthetic: Red accent strip at the very top of site */}
      <div className="h-2.5 bg-[#D9383A] w-full" />

      {/* Styled Grid Header */}
      <header className="bg-white border-b-4 border-[#191919] sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            {/* Bold graphic stamp marker */}
            <div className="p-3 bg-white border-3 border-[#191919] text-[#191919] font-black tracking-widest text-center select-none rotate-[-1.5deg] leading-none shrink-0 shadow-[2px_2px_0px_0px_rgba(25,25,25,1)]">
              <span className="text-[14px]">印</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase text-slate-900">
                GIT TIMELINE DESIGNER
              </h1>
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                - GIT TIMELINE BLUEPRINT MACHINE & CLI FABRICATOR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#191919] bg-white hover:bg-slate-50 transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] active:translate-y-0.5 active:shadow-none"
            >
              <Github className="h-4 w-4" />
              <span>GITHUB GUIDE</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        
        {/* Row 1: The beautiful visual welcome advisory banner */}
        <WelcomeBanner />

        {/* Workspace dual columns: 12-column template layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Custom CLI parameters (5 spans) */}
          <div className="lg:col-span-5 space-y-6">
            <ControlPanel 
              config={config} 
              onChange={handleConfigChange} 
            />

            {/* Explanatory Stamp Booklet section */}
            <div className="bg-white border-3 border-[#191919] p-5 shadow-[4px_4px_0px_0px_rgba(25,25,25,1)] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 font-bold select-none text-[80px] leading-none text-[#D9383A] pointer-events-none uppercase mr-2 font-mono">
                OK
              </div>
              <h4 className="font-extrabold text-[11px] uppercase text-[#D9383A] tracking-widest flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 shrink-0" />
                HOW METADATA PARSING WORKS
              </h4>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">
                The Git database stores two distinct date metrics for every snapshot of historical code: the 
                <strong> AUTHOR DATE</strong> (the hour in time a developer created the change) and the 
                <strong> COMMITTER DATE</strong> (when the commit became integrated). 
              </p>
              <p className="text-slate-700 text-xs leading-relaxed mt-2 font-medium">
                When you pass variables via <code className="bg-slate-100 text-[#D9383A] px-1 font-mono font-bold">GIT_AUTHOR_DATE</code>, GitHub hooks 
                directly into that date metadata to fill your green-square timeline, completely bypassing the actual network push calendar date!
              </p>
            </div>
          </div>

          {/* Right panel: Active Matrix Canvas & companion code structures (7 spans) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 53-week interactive contribution matrix */}
            <ContributionGrid 
              activities={activities} 
              stats={stats} 
              onModifyDay={handleModifyDay}
              onResetManualOverrides={handleResetManualOverrides}
              onApplyPresetPattern={handleApplyPresetPattern}
              hasManualOverrides={hasManualOverrides}
            />

            {/* Python code output tabs screen */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs text-[#191919] font-black uppercase tracking-wider">
                  <FileText className="h-4.5 w-4.5 text-[#D9383A]" />
                  SIMULATION EXPORT // CODE OUTPUT DECK
                </div>
              </div>

              <CodeViewer 
                pythonCode={pythonScriptCode} 
                testCode={testScriptCode} 
                filename={config.trackingFile} 
              />
            </div>

          </div>

        </div>

      </main>

      {/* Styled off-black graphic-sheet footer */}
      <footer className="border-t-4 border-[#191919] mt-16 py-12 px-6 bg-white text-center text-[#191919] relative">
        <div className="max-w-7xl mx-auto space-y-4 font-mono">
          {/* Creator Profile Badge Link */}
          <div className="flex justify-center">
            <a
              id="creator-github-badge"
              href="https://github.com/sungjinwoo-monarch"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#191919] bg-[#FCFAF2] hover:bg-white text-[#191919] transition-all shadow-[4px_4px_0px_0px_rgba(25,25,25,1)] active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Github className="h-4 w-4 text-[#D9383A]" />
              <span>CREATOR // ISTAB MAIBAM</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
