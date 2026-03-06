import { Metadata } from 'next';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: "CheckBeforeCommit | Understand Any Codebase in Minutes",
  description: "Stop guessing and start knowing. Get instant clarity on system architecture, complexity hot-spots, and integration risks for any GitHub repository.",
  openGraph: {
    title: "CheckBeforeCommit | Understand Any Codebase in Minutes",
    description: "High-fidelity mental models of your code. Architecture mapping, risk analysis, and entry points for any repo.",
  },
};

export default function Home() {
  return <LandingClient />;
}
