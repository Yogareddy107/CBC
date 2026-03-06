import { AnalysisReport } from '@/components/AnalysisReport';
import { MOCK_ANALYSIS } from '@/lib/llm/client';
import { Navbar } from '@/components/Navbar'; // Assuming Navbar exists and takes user prop

export default function VerifyReportPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar user={null} />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
                    <strong>VERIFICATION MODE:</strong> Rendering Gold Standard Mock Analysis.
                </div>
                <AnalysisReport data={MOCK_ANALYSIS} repoUrl="https://github.com/check-before-commit/demo-repo" />
            </div>
        </div>
    );
}
