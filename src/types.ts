export interface GeneratorConfig {
  maxCommitsPerDay: number;
  commitDensity: number; // 0 to 1
  skipWeekends: boolean;
  daysBack: number;
  daysForward: number;
  remoteUrl: string;
  branchName: string;
  trackingFile: string;
  commitMessage: string;
  authorName: string;
  authorEmail: string;
  randomizeTime: boolean;
  timeRangeStart: number; // hour
  timeRangeEnd: number; // hour
  preset: string; // 'custom' | 'busy' | 'sparse' | 'waves' | 'weekends-only'
  
  // Newly added simulation attributes
  commitMsgLibrary: 'architect' | 'chaotic' | 'corporate' | 'gitmoji';
  vacationWeeks: number; // consecutive weeks of 0 commits
  peakDay: number; // -1 for none, 1-5 for Mon-Fri peak boosts
  jitterMode: boolean; // Add micro-variance to mimic realistic energy level fluctuations
}

export interface DayActivity {
  date: Date;
  dateStr: string;
  commitCount: number;
  isWeekend: boolean;
  isVacation: boolean;
  isPeakDay: boolean;
}

export interface GenerationStats {
  totalCommits: number;
  totalDays: number;
  activeDaysCount: number;
  activeDaysPercentage: number;
  weekendCommits: number;
}
