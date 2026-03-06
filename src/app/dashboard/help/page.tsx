import { HelpCircle } from 'lucide-react';

function SectionCard({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
  return (
    <section className="group rounded-2xl border border-border/20 bg-secondary/5 p-8 shadow-sm transition-colors hover:bg-amber-50/60">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold">
            {number}
          </div>
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
            {title}
          </h2>
        </div>
        <div className="text-xs text-muted-foreground">Hover to highlight</div>
      </div>
      <div className="space-y-4 text-sm text-foreground/80 leading-relaxed max-w-3xl">
        {children}
      </div>
    </section>
  );
}

export default function DashboardHelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-primary">
          <HelpCircle className="w-6 h-6" />
          <h1 className="text-3xl font-bold tracking-tight">Help</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Quick reference for how CheckBeforeCommit works and what to expect from the report.
        </p>
      </header>

      <SectionCard number={1} title="Introduction">
        <p>
          CheckBeforeCommit is a developer tool that analyzes GitHub repositories and generates a technical
          health report. It evaluates repository structure, dependencies, maintainer activity, and code signals to
          help developers decide whether a project is reliable and worth adopting.
        </p>
      </SectionCard>

      <SectionCard number={2} title="How It Works">
        <div className="space-y-3">
          <div>
            <p className="font-semibold">Step 1 – Enter a GitHub Repository</p>
            <p>Paste a public GitHub repository URL into the analysis field.</p>
            <code className="block rounded bg-secondary/20 p-2 text-xs">https://github.com/user/project</code>
          </div>
          <div>
            <p className="font-semibold">Step 2 – Start Analysis</p>
            <p>Click Analyze Repository. The system scans the repository and extracts structural signals.</p>
          </div>
          <div>
            <p className="font-semibold">Step 3 – View the Report</p>
            <p>The tool generates a report showing:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Architecture overview</li>
              <li>Dependency complexity</li>
              <li>Maintainability signals</li>
              <li>Risk indicators</li>
              <li>Overall repository verdict</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={3} title="Features">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">Repository Structure Analysis</span>
            <br />Examines folder structure and project organization.
          </li>
          <li>
            <span className="font-semibold">Dependency Health Check</span>
            <br />Detects outdated or risky dependencies.
          </li>
          <li>
            <span className="font-semibold">Maintainer Activity Tracking</span>
            <br />Analyzes commit frequency and contributor activity.
          </li>
          <li>
            <span className="font-semibold">Technical Risk Detection</span>
            <br />Identifies structural patterns that increase long-term maintenance cost.
          </li>
          <li>
            <span className="font-semibold">Quick Verdict</span>
            <br />Provides a simple evaluation of whether the repository is safe to adopt.
          </li>
        </ul>
      </SectionCard>

      <SectionCard number={4} title="Understanding the Report">
        <div className="space-y-3">
          <div>
            <p className="font-semibold">Architecture Overview</p>
            <p>Shows the structure of the repository and how components are organized.</p>
          </div>
          <div>
            <p className="font-semibold">Maintainability Score</p>
            <p>Measures how easy the codebase will be to maintain long-term.</p>
          </div>
          <div>
            <p className="font-semibold">Risk Signals</p>
            <p>Highlights potential problems such as:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>High dependency complexity</li>
              <li>Low contributor activity</li>
              <li>Lack of testing</li>
              <li>Poor folder structure</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Verdict</p>
            <p>A final summary indicating whether the project appears stable, risky, or needs further review.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={5} title="Supported Repositories">
        <p>Currently supported:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Public GitHub repositories</li>
          <li>JavaScript / TypeScript projects</li>
          <li>Python projects</li>
          <li>Node.js applications</li>
        </ul>
        <p>Future support may include additional languages and private repositories.</p>
      </SectionCard>

      <SectionCard number={6} title="Troubleshooting">
        <p>Repository not loading? Check if:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>The repository URL is correct</li>
          <li>The repository is public</li>
          <li>GitHub API rate limits are not exceeded</li>
        </ul>
      </SectionCard>

      <SectionCard number={7} title="FAQ">
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Q: Does this tool modify my repository?</p>
            <p>No. CheckBeforeCommit only analyzes public repository data.</p>
          </div>
          <div>
            <p className="font-semibold">Q: Does it support private repositories?</p>
            <p>Currently only public repositories are supported.</p>
          </div>
          <div>
            <p className="font-semibold">Q: How long does analysis take?</p>
            <p>Most repositories are analyzed within a few seconds.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={8} title="Contact / Support">
        <p>If you experience issues or want to report bugs:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Email: <a href="mailto:teamintrasphere@gmail.com" className="text-primary hover:underline">teamintrasphere@gmail.com</a>
          </li>
          <li>
            Privacy Policy: <a href="https://cbc1.vercel.app/privacy" className="text-primary hover:underline">https://cbc1.vercel.app/privacy</a>
          </li>
          <li>
            Terms of Service: <a href="https://cbc1.vercel.app/terms" className="text-primary hover:underline">https://cbc1.vercel.app/terms</a>
          </li>
          <li>
            Cookie Policy: <a href="https://cbc1.vercel.app/cookies" className="text-primary hover:underline">https://cbc1.vercel.app/cookies</a>
          </li>
        </ul>
      </SectionCard>

      <div className="rounded-2xl border border-border/20 bg-secondary/5 p-6">
        <p className="text-sm text-muted-foreground">
          Important advice: This page avoids marketing hype. It focuses on how the tool works, what it provides, and how to use it.
        </p>
      </div>
    </div>
  );
}
