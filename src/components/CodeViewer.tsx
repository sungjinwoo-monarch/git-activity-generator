import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, FileCode, CheckSquare, HelpCircle, BookOpen } from 'lucide-react';

interface CodeViewerProps {
  pythonCode: string;
  testCode: string;
  filename: string;
}

export default function CodeViewer({ pythonCode, testCode, filename }: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<'script' | 'tests' | 'guide'>('script');
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy!", e);
    }
  };

  const downloadFile = (content: string, name: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActiveContent = () => {
    if (activeTab === 'script') return pythonCode;
    if (activeTab === 'tests') return testCode;
    return '';
  };

  return (
    <div id="code-viewer" className="bg-white border-[3px] border-[#191919] shadow-[5px_5px_0px_0px_rgba(25,25,25,1)] overflow-hidden text-[#191919] relative">
      
      {/* Decorative vertical stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D9383A]" />

      {/* Tab Select Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-[#FCFAF2] border-b-2 border-[#191919] px-4 py-3 gap-3">
        
        {/* Left Side: tab buttons with solid layout */}
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
          <button
            id="tab-btn-script"
            onClick={() => { setActiveTab('script'); setCopied(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-[#191919] transition-all cursor-pointer ${
              activeTab === 'script'
                ? 'bg-[#191919] text-[#FCFAF2]'
                : 'bg-white text-[#191919] hover:bg-slate-50'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            git_generator.py
          </button>
          
          <button
            id="tab-btn-tests"
            onClick={() => { setActiveTab('tests'); setCopied(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-[#191919] transition-all cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-[#191919] text-[#FCFAF2]'
                : 'bg-white text-[#191919] hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
            test_framework.py
          </button>
          
          <button
            id="tab-btn-guide"
            onClick={() => { setActiveTab('guide'); setCopied(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-[#191919] transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#191919] text-[#FCFAF2]'
                : 'bg-white text-[#191919] hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#D9383A]" />
            RUN GUIDE
          </button>
        </div>

        {/* Copy & download controls */}
        {activeTab !== 'guide' && (
          <div className="flex items-center gap-2 justify-end">
            <button
              id="copy-code-btn"
              onClick={() => handleCopy(getActiveContent())}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-[#191919] bg-white text-[#191919] hover:bg-slate-50 transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  COPIED SUCCESS!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  COPY CODE
                </>
              )}
            </button>

            <button
              id="download-code-btn"
              onClick={() => {
                const isScript = activeTab === 'script';
                const fileToDl = isScript ? pythonCode : testCode;
                const nameToDl = isScript ? 'git_generator.py' : 'test_git_generator.py';
                downloadFile(fileToDl, nameToDl);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-[#191919] bg-[#D9383A] text-white transition-all shadow-[2px_2px_0px_0px_rgba(25,25,25,1)] hover:bg-[#A82425] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        )}
      </div>

      {/* Editor Space */}
      <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed select-text bg-[#FAF8F5]">
        
        {activeTab === 'guide' ? (
          <div className="space-y-6 text-[#1a1a1a] select-text p-2" id="guide-tab-view">
            
            <div className="border-b-[2px] border-dashed border-[#191919]/20 pb-4">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#D9383A] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#D9383A]" />
                STEP 01: SYSTEM MINIMUM REQS
              </h4>
              <p className="text-slate-700 text-xs mb-2">
                Your computer must possess standard installations of <strong className="text-black">Python (version 3.x)</strong> and <strong className="text-black">Git CLI</strong>:
              </p>
              <pre className="bg-[#191919] p-3 text-white overflow-x-auto font-mono text-[11px] font-medium border-l-[3px] border-[#D9383A]">
                python3 --version<br />
                git --version
              </pre>
            </div>

            <div className="border-b-[2px] border-dashed border-[#191919]/20 pb-4">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#191919] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#191919]" />
                STEP 02: CREATE COMPACT SANDBOX Folder
              </h4>
              <p className="text-slate-700 text-xs mb-2">
                Initialize an empty folder directory, move the script file inside, and enter it:
              </p>
              <pre className="bg-[#191919] p-3 text-white overflow-x-auto font-mono text-[11px] font-medium border-l-[3px] border-[#191919]">
                # Spawn a clean local sandbox directory<br />
                mkdir my-contribution-sandbox<br />
                cd my-contribution-sandbox<br /><br />
                # Grant executable permissions on Linux/macOS<br />
                chmod +x git_generator.py<br /><br />
                # Output default parameters index<br />
                python3 git_generator.py --help
              </pre>
            </div>

            <div className="border-b-[2px] border-dashed border-[#191919]/20 pb-4">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#316938] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#316938]" />
                STEP 03: EXECUTE DESIGN PARAMETERS
              </h4>
              <p className="text-slate-700 text-xs mb-2">
                Launch the simulation. Specify target boundaries using customizable arguments:
              </p>
              <pre className="bg-[#191919] p-3 text-white overflow-x-auto font-mono text-[11px] font-medium border-l-[3px] border-[#316938]">
                # Generate standard custom profile commits<br />
                python3 git_generator.py<br /><br />
                # Skip weekends, define maximums, configure custom activity densities<br />
                python3 git_generator.py --max-commits 8 --density 0.65 --skip-weekends --days-back 365<br /><br />
                # Pass your profile credentials to ensure Github parses user maps successfully<br />
                python3 git_generator.py --user-name "Satoshi" --user-email "satoshi@bitcoin.org"
              </pre>
            </div>

            <div className="pb-2">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#191919]" id="help-verify-anchor">
                💡 TROUBLESHOOTING GITHUB INTEGRATION
              </h4>
              <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                If the squares are not appearing as green or crimson matrices on your profile board immediately:
              </p>
              <div className="mt-2 p-3 bg-[#FCFAF2] border-2 border-[#191919] text-xs font-mono space-y-2">
                <div>
                  <span className="font-extrabold text-[#D9383A] block">1. CHECK AUTHOR EMAIL PARSER:</span>
                  GitHub only ties commits to your contribution chart if the author email matches your primary account email. Validate this inside your terminal output repo by checking:
                  <div className="bg-white px-2 py-1 mt-1 border border-black text-[11px] inline-block font-mono">
                    git log -1 --pretty=format:"%ae"
                  </div>
                </div>
                <div>
                  <span className="font-extrabold text-blue-600 block">2. TARGET THE PRIMARY BRANCH:</span>
                  GitHub only indexes activity files on the primary/main branch. Ensure your target branch set matches your repository primary branches!
                </div>
              </div>
            </div>

          </div>
        ) : (
          <pre className="text-slate-950 leading-normal select-text whitespace-pre overflow-x-auto font-medium" id="code-snippet-pre">
            {getActiveContent()}
          </pre>
        )}
      </div>

    </div>
  );
}
