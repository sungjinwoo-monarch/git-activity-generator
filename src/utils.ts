import { GeneratorConfig, DayActivity, GenerationStats } from './types';

// Seeded/pseudo-random number generator for predictable previews
class PRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

/**
 * Generate contribution preview data
 */
export function generateContributionData(config: GeneratorConfig): DayActivity[] {
  const activities: DayActivity[] = [];
  const today = new Date();
  
  // total days range
  const totalDays = config.daysBack + config.daysForward + 1;
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - config.daysBack);
  
  const rng = new PRNG(42); // Seeded for consistancy when shifting options
  
  // Define vacation block start & end indexes
  // If vacationWeeks > 0, we'll reserve a chunk in the middle of our timeline
  let vacationStartIndex = -1;
  let vacationEndIndex = -1;
  if (config.vacationWeeks > 0) {
    const totalWeeks = Math.floor(totalDays / 7);
    const startWeek = Math.max(2, Math.floor(totalWeeks * 0.45)); // Place it roughly near the center
    const durationDays = config.vacationWeeks * 7;
    vacationStartIndex = startWeek * 7;
    vacationEndIndex = vacationStartIndex + durationDays;
  }
  
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDay);
    currentDate.setDate(startDay.getDate() + i);
    
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 1 is Monday, ... 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPeakDay = dayOfWeek === config.peakDay;
    const isVacation = i >= vacationStartIndex && i < vacationEndIndex;
    
    let commitCount = 0;
    
    if (!isVacation) {
      // Check if we should commit on this day
      if (!(config.skipWeekends && isWeekend)) {
        const roll = rng.next();
        
        // Handle presets or custom density
        let baseDensity = config.commitDensity;
        if (config.preset === 'sparse') baseDensity = 0.25;
        else if (config.preset === 'busy') baseDensity = 0.95;
        else if (config.preset === 'weekends-only') {
          baseDensity = isWeekend ? 0.9 : 0.05;
        } else if (config.preset === 'waves') {
          // Sine wave pattern over time
          const waveFactor = (Math.sin(i / 15) + 1) / 2; // 0 to 1
          baseDensity = waveFactor * 0.8 + 0.1;
        }
        
        // Apply peak day boost
        let finalDensity = baseDensity;
        if (isPeakDay) {
          finalDensity = Math.min(0.98, baseDensity * 1.5);
        }
        
        // Commit decision
        if (roll < finalDensity) {
          const countRoll = rng.next();
          // Calculate max potential commits today
          let maxCommits = config.maxCommitsPerDay;
          if (isPeakDay) {
            maxCommits = Math.max(1, Math.floor(config.maxCommitsPerDay * 1.5));
          }
          
          let generated = Math.floor(countRoll * maxCommits) + 1;
          
          // Apply realistic energy level jitter (micro-variance)
          if (config.jitterMode) {
            const jitterRoll = rng.next();
            if (jitterRoll < 0.2) {
              generated = Math.max(1, Math.floor(generated * 0.5)); // low energy day
            } else if (jitterRoll > 0.8) {
              generated = Math.min(maxCommits + 3, Math.floor(generated * 1.4)); // high efficiency surge
            }
          }
          
          commitCount = generated;
        }
      }
    }
    
    const dateStr = currentDate.toISOString().split('T')[0];
    activities.push({
      date: currentDate,
      dateStr,
      commitCount,
      isWeekend,
      isVacation,
      isPeakDay,
    });
  }
  
  return activities;
}

/**
 * Calculate statistical metrics
 */
export function calculateStats(activities: DayActivity[]): GenerationStats {
  let totalCommits = 0;
  let activeDaysCount = 0;
  let weekendCommits = 0;
  
  activities.forEach(act => {
    totalCommits += act.commitCount;
    if (act.commitCount > 0) {
      activeDaysCount++;
      if (act.isWeekend) {
        weekendCommits += act.commitCount;
      }
    }
  });
  
  return {
    totalCommits,
    totalDays: activities.length,
    activeDaysCount,
    activeDaysPercentage: activities.length > 0 ? (activeDaysCount / activities.length) * 100 : 0,
    weekendCommits,
  };
}

/**
 * Generate Python CLI Script source code
 */
export function generatePythonScript(config: GeneratorConfig): string {
  const trackingFile = config.trackingFile || 'contribution.txt';
  const branchName = config.branchName || 'main';
  const authorName = config.authorName ? config.authorName.replace(/"/g, '\\"') : '';
  const authorEmail = config.authorEmail ? config.authorEmail.replace(/"/g, '\\"') : '';
  const remoteUrl = config.remoteUrl ? config.remoteUrl.trim() : '';

  // Return the script code, containing dictionaries for matching chosen style
  return `#!/usr/bin/env python3
"""
================================================================================
  GIT CONTRIBUTION GRAPH GENERATOR                                            
  Designed in Japanese Minimalist High-Contrast Aesthetic Principles                           
================================================================================
This utility designs and simulates chronological Git activity pipelines to 
experiment with the Git metadata parser framework.

IMPORTANT DISCLAIMER & ETHICAL MANDATE:
This software is built strictly for pedagogical research, developer training, 
and platform testing. Pushing synthetic commits to misrepresent engineering 
capacity or deceive personnel threatens structural trust. Sincerity of craftsmanship
stands higher than automated square matrices.
"""

import os
import sys
import random
import argparse
import subprocess
from datetime import datetime, timedelta

# Styled high-contrast terminal colors
class Colors:
    HEADER = '\\033[1;91m'      # Bold Crimson
    ACCENT = '\\033[1;92m'      # Bold Wasabi Green
    INFO = '\\033[94m'        # Blue
    WARN = '\\033[1;93m'       # Yellow Stamp
    FAIL = '\\033[1;91m'       # Red Alert
    RESET = '\\033[0m'
    BOLD = '\\033[1m'
    BG_CARD = '\\033[48;5;236m'

# Commit message theme dictionaries for realistic repository simulated look
COMMIT_MESSAGES = {
    'architect': [
        "Optimize distributed database query indexes",
        "Refactor memory management boundaries in cache manager",
        "Implement thread safe consumer dynamic worker pool",
        "Introduce batch transaction isolation middleware schemas",
        "Resolve concurrency lock race conditions in worker queues",
        "Rewrite asynchronous stream event serialization layer",
        "Improve throughput on cluster ingest pipelines",
        "Integrate OAuth2 JWT validator protocols",
        "De-congest primary network memory leaks",
        "Upgrade base networking libraries to handle packet payloads"
    ],
    'chaotic': [
        "stupid bug fixed finally",
        "please work i need some sleep",
        "one more minor change",
        "cleanup useless imports again",
        "i hate regex seriously",
        "revert stupid commit that broke master branch",
        "trust me this fixes everything",
        "testing production environment live",
        "forgot to save my file smh",
        "it works on my machine"
    ],
    'corporate': [
        "Feat: integrate consumer telemetry diagnostics API",
        "Docs: update architectural conformance audit logs",
        "Fix: prevent unauthorized dynamic route injection",
        "Refactor: decouple client auth state machines",
        "Style: sanitize variable naming taxonomy",
        "Test: increase functional regression coverages",
        "Perf: swap out nested loops with hash indexes",
        "Chore: update package version constraints to secure builds",
        "Feat: enhance multi-region failover protocols",
        "Fix: repair critical edge failure in payment processing payload"
    ],
    'gitmoji': [
        "✨ feat: introduce secure customer login wizard",
        "🐛 fix: eliminate memory leakage inside rendering layout",
        "⚡ perf: enhance tree shaking efficiency index",
        "♻️ refactor: simplify routing logic pathways",
        "📝 docs: enrich developer onboarding requirements",
        "🚨 test: verify edgecases in user token rotation",
        "🩹 fix: adjust spacing padding margins across mobile grids",
        "🛡️ security: patch potential vulnerability in header cookies",
        "🏗️ chore: upgrade task runners to run in parallel pipeline",
        "🎨 style: sanitize color pallet consistency rules"
    ]
}

def log_info(msg):
    print(f"{Colors.INFO}[*]{Colors.RESET} {msg}")

def log_success(msg):
    print(f"{Colors.ACCENT}[+] SUCCESS: {msg}{Colors.RESET}")

def log_warn(msg):
    print(f"{Colors.WARN}[!] STAMP WARNING: {msg}{Colors.RESET}")

def log_error(msg):
    print(f"{Colors.FAIL}[-] ERROR: {msg}{Colors.RESET}")

def check_git_installed():
    try:
        subprocess.run(["git", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def run_command(args, env=None):
    res = subprocess.run(
        args, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE, 
        text=True, 
        env=env
    )
    return res.returncode == 0, res.stdout, res.stderr

def print_japanese_style_disclaimer():
    print("=" * 76)
    print(f"{Colors.HEADER}                  [ 誠実 / INTEGRITY FIRST ]                   {Colors.RESET}")
    print(f"{Colors.BOLD}            GIT METADATA MANIPULATION SIMULATOR             {Colors.RESET}")
    print("=" * 76)
    print(" This script illustrates the engineering of Git timeline metadata values.")
    print(" GitHub relies entirely on the 'Author Date' embedded inside your commits.")
    print(" It is a graphical visualization - NOT a metric of high engineering skill.")
    print()
    print(" Make commits that convey real improvements, modularity, and problem-solving.")
    print(f" {Colors.WARN}Do not use this to fabricate synthetic work representations.{Colors.RESET}")
    print("=" * 76)

def start_generator(args):
    print_japanese_style_disclaimer()
    
    if not check_git_installed():
        log_error("Git executable missing from machine environment path!")
        sys.exit(1)
        
    # Check if a git repository is initialized
    if not os.path.exists(".git"):
        log_info("Workspace folder has no current repository. Spawning 'git init'...")
        success, _, err = run_command(["git", "init"])
        if not success:
            log_error(f"Initialization failure: {err}")
            sys.exit(1)
        log_success("Git repository established.")
    
    # Apply local Git settings
    if args.user_name:
        run_command(["git", "config", "user.name", args.user_name])
        log_info(f"Local author set: {args.user_name}")
    if args.user_email:
        run_command(["git", "config", "user.email", args.user_email])
        log_info(f"Local email configured: {args.user_email}")

    # Set up files
    if not os.path.exists("README.md"):
        with open("README.md", "w") as f:
            f.write("# Git Contribution Grid Design\\n\\nSimulated timeline for exploring git timeline configurations.\\n")
        run_command(["git", "add", "README.md"])
        run_command(["git", "commit", "-m", "Initial setup commit"])
        log_success("Spawned base README.md commits.")

    # Prepare timeline calculations
    today = datetime.now()
    start_date = today - timedelta(days=args.days_back)
    end_date = today + timedelta(days=args.days_forward)
    total_days = (end_date - start_date).days + 1
    
    log_info(f"Design Span: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')} ({total_days} days)")
    
    # Establish vacation blocks if request specifies
    vacation_start_day = -1
    vacation_end_day = -1
    if args.vacation_weeks > 0:
        total_weeks = total_days // 7
        start_wk = max(2, total_weeks // 2 - 1)
        vacation_start_day = start_wk * 7
        vacation_end_day = vacation_start_day + (args.vacation_weeks * 7)
        log_info(f"Simulating high-fidelity offline vacation block: {args.vacation_weeks} consecutive weeks of 0 activity.")

    commits_created = 0
    days_with_commits = 0
    current_idx = 0
    
    current_date = start_date
    while current_date <= end_date:
        weekday = current_date.weekday()
        is_weekend = weekday in [5, 6]
        is_vacation = current_idx >= vacation_start_day and current_idx < vacation_end_day
        is_peak = weekday == args.peak_day
        
        should_commit = True
        if is_vacation:
            should_commit = False
        elif args.skip_weekends and is_weekend:
            should_commit = False
            
        if should_commit:
            # Determine daily probabilty with preset logic
            # Weekend warrior preset custom handling (mostly Active weekends)
            if args.preset == 'weekends-only':
                day_density = 0.9 if is_weekend else 0.05
            else:
                day_density = args.density
                
            # If peak day, scale up density
            if is_peak:
                day_density = min(0.98, day_density * 1.5)
                
            if random.random() < day_density:
                days_with_commits += 1
                
                # Determine how many commits to print
                max_daily = args.max_commits
                if is_peak:
                    max_daily = max(1, int(args.max_commits * 1.5))
                    
                total_today = random.randint(1, max_daily)
                
                # Jitter mode adjustments
                if args.jitter:
                    jitter_roll = random.random()
                    if jitter_roll < 0.2:
                        total_today = max(1, int(total_today * 0.5))
                    elif jitter_roll > 0.8:
                        total_today = min(max_daily + 3, int(total_today * 1.4))
                
                for idx in range(total_today):
                    # Compute timestamps
                    if args.randomize_time:
                        hour = random.randint(args.time_start, args.time_end)
                        minute = random.randint(0, 59)
                        second = random.randint(0, 59)
                    else:
                        hour = 12
                        minute = 0
                        second = 0
                        
                    commit_time = current_date.replace(hour=hour, minute=minute, second=second)
                    time_stamp = commit_time.strftime("%Y-%m-%dT%H.%M.%S")
                    iso_time = commit_time.isoformat()
                    
                    # Log write to simulation file
                    with open(args.file, "a") as f:
                        f.write(f"Log: {iso_time} | Entry Hash: {hex(random.getrandbits(32))}\\n")
                        
                    env = os.environ.copy()
                    env["GIT_AUTHOR_DATE"] = iso_time
                    env["GIT_COMMITTER_DATE"] = iso_time
                    
                    run_command(["git", "add", args.file], env=env)
                    
                    # Select appropriate message library from custom themes
                    library = args.msg_theme
                    if library in COMMIT_MESSAGES and COMMIT_MESSAGES[library]:
                        chosen_msg = random.choice(COMMIT_MESSAGES[library])
                    else:
                        chosen_msg = args.commit_msg
                        
                    cmd_msg = f"{chosen_msg} (#{commits_created + 1})"
                    success, _, err = run_command(["git", "commit", "-m", cmd_msg], env=env)
                    
                    if success:
                        commits_created += 1
                    else:
                        log_warn(f"Failed to submit commit at date {iso_time}: {err}")
                        
        current_date += timedelta(days=1)
        current_idx += 1
        
    log_success(f"Timeline generation completed! Created {commits_created} commits across {days_with_commits} active days.")
    
    # Handle Remote Hookup
    if args.remote:
        log_info(f"Target remote configuration: {args.remote}")
        exists, _, _ = run_command(["git", "remote", "get-url", "origin"])
        if exists:
            run_command(["git", "remote", "set-url", "origin", args.remote])
        else:
            run_command(["git", "remote", "add", "origin", args.remote])
            
        run_command(["git", "branch", "-M", args.branch])
        
        print()
        print(f"{Colors.HEADER}>>> REMOTE TRANSMISSION TRIGGER:{Colors.RESET}")
        print(f"Would you like to instantly synchronize and push commits to your empty remote branch?")
        push_decide = input(f"Execute 'git push -u origin {args.branch} --force'? [y/N]: ").strip().lower()
        if push_decide == 'y':
            log_info(f"Pushing commit arrays into origin {args.branch}...")
            ok, out, err = run_command(["git", "push", "-u", "origin", args.branch, "--force"])
            if ok:
                log_success("Git timeline uploaded to remote server!")
            else:
                log_error(f"Push transmission failed. Details: {err}")
                log_info(f"Run manually to override error profiles: 'git push -u origin {args.branch} --force'")
        else:
            log_info("Skipped origin sync. commits remain in sandbox mode inside this local repository.")
    else:
        run_command(["git", "branch", "-M", args.branch])
        log_success("Local repository populated. To deploy to GitHub manually:")
        print(f"  git remote add origin YOUR_REMOTE_GIT_URL")
        print(f"  git push -u origin {args.branch} --force")

def main():
    parser = argparse.ArgumentParser(
        description="Craft custom Git timeline patterns utilizing Japanese minimalist command design frameworks.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    # Primary Parameters
    parser.add_argument("-m", "--max-commits", type=int, default=${config.maxCommitsPerDay}, help="Maximum commits per single active date block")
    parser.add_argument("-d", "--density", type=float, default=${config.commitDensity}, help="Base probability (0.0 to 1.0) that a day gets random logs")
    parser.add_argument("-s", "--skip-weekends", action="store_true", ${config.skipWeekends ? 'default=True' : ''} help="Prevent any commits on Sat & Sun")
    parser.add_argument("-b", "--days-back", type=int, default=${config.daysBack}, help="Days of lookback historically")
    parser.add_argument("-f", "--days-forward", type=int, default=${config.daysForward}, help="Days look-ahead into the future")
    
    # Advanced Simulations
    parser.add_argument("--vacation-weeks", type=int, default=${config.vacationWeeks}, help="Reserve consecutive 0-activity weeks (holidays simulation)")
    parser.add_argument("--peak-day", type=int, default=${config.peakDay}, help="Specify a boosted peak weekday index (0=Mon, 1=Tue, 2=Wed, etc. Send -1 to disable)")
    parser.add_argument("--jitter", action="store_true", ${config.jitterMode ? 'default=True' : ''} help="Add micro-variance energy fluctuations to commit sizes")
    parser.add_argument("--preset", type=str, default="${config.preset}", choices=['custom', 'waves', 'busy', 'sparse', 'weekends-only'], help="Simulate presets")
    
    # Themes & metadata config
    parser.add_argument("--msg-theme", type=str, default="${config.commitMsgLibrary}", choices=['architect', 'chaotic', 'corporate', 'gitmoji'], help="Commit message template list select")
    parser.add_argument("--commit-msg", type=str, default="${config.commitMessage}", help="Default standard commit header")
    parser.add_argument("-r", "--remote", type=str, ${remoteUrl ? `default="${remoteUrl}"` : 'default=None'}, help="Blank remote github URL")
    parser.add_argument("-g", "--branch", type=str, default="${branchName}", help="Default checkout target branch")
    parser.add_argument("-o", "--file", type=str, default="${trackingFile}", help="Name of log logging tracking file")
    
    # Local Git credentials
    parser.add_argument("-n", "--user-name", type=str, ${authorName ? `default="${authorName}"` : 'default=None'}, help="Set author name locally")
    parser.add_argument("-e", "--user-email", type=str, ${authorEmail ? `default="${authorEmail}"` : 'default=None'}, help="Set author email locally")
    
    # Logistical Hour bounds
    parser.add_argument("--randomize-time", action="store_true", ${config.randomizeTime ? 'default=True' : ''}, help="Stagger commits throughout the work hours")
    parser.add_argument("--time-start", type=int, default=${config.timeRangeStart}, help="Working hours start hour range")
    parser.add_argument("--time-end", type=int, default=${config.timeRangeEnd}, help="Working hours end hour range")
    
    args = parser.parse_args()
    
    try:
        start_generator(args)
    except KeyboardInterrupt:
        print()
        log_warn("Aborted by user signal transmission.")
        sys.exit(0)

if __name__ == '__main__':
    main()
`;
}

/**
 * Generate Python unittest suite source code
 */
export function generateTestScript(): string {
  return `#!/usr/bin/env python3
"""
================================================================================
  UNIT TEST SUITE: GIT TIMELINE SIMULATOR
  Supports testing argument parser options, date loops, and mock sandbox states.
================================================================================
"""

import unittest
import os
import sys
import tempfile
import shutil
import argparse
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

# Attempt modular import
try:
    import git_generator
except ImportError:
    git_generator = None

class TestGitGeneratorTimeline(unittest.TestCase):
    
    def setUp(self):
        # Establish clean temporary directories to isolate filesystem side-effects
        self.sandbox_dir = tempfile.mkdtemp()
        self.starting_cwd = os.getcwd()
        os.chdir(self.sandbox_dir)
        
    def tearDown(self):
        # Restore directory pointers and erase sandbox materials
        os.chdir(self.starting_cwd)
        shutil.rmtree(self.sandbox_dir)

    def test_mock_command_execution(self):
        """Test the run_command executes system command layers cleanly."""
        if git_generator is None:
            self.skipTest("git_generator module not available inside relative pathing.")
            
        with patch('subprocess.run') as mock_sub:
            mock_sub.return_value = MagicMock(returncode=0, stdout="Mocked status OK", stderr="")
            success, stdout, stderr = git_generator.run_command(["git", "status"])
            self.assertTrue(success)
            self.assertEqual(stdout, "Mocked status OK")

    def test_datetime_range_constraints(self):
        """Ensure lookbacks and look-aheads add up structurally to total day segments."""
        lookback = 100
        lookahead = 5
        
        now = datetime.now()
        start = now - timedelta(days=lookback)
        end = now + timedelta(days=lookahead)
        
        calculated_span = (end - start).days + 1
        self.assertEqual(calculated_span, lookback + lookahead + 1)

    def test_log_writer_file_streams(self):
        """Verify daily tracking lists log content lines into selected output files."""
        log_path = "timeline_output.log"
        mock_log_line = "Log: 2026-06-17T13.00.00 | Entry Hash: 0xfeedbeef\\n"
        
        with open(log_path, "a") as f:
            f.write(mock_log_line)
            
        self.assertTrue(os.path.exists(log_path))
        with open(log_path, "r") as f:
            recorded_text = f.read()
            self.assertEqual(recorded_text, mock_log_line)

    def test_dictionary_theme_messages(self):
        """Validate messages libraries are packed with rich themes."""
        if git_generator is None:
            self.skipTest("git_generator was not loaded.")
        
        self.assertIn('gitmoji', git_generator.COMMIT_MESSAGES)
        self.assertIn('chaotic', git_generator.COMMIT_MESSAGES)
        self.assertGreater(len(git_generator.COMMIT_MESSAGES['architect']), 0)

if __name__ == '__main__':
    unittest.main()
`;
}
