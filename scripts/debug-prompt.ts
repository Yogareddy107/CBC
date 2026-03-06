
import { getRepoData } from '../src/lib/github/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// MOCK OpenAI to capture prompt
const mockOpenAI = {
    chat: {
        completions: {
            create: async (params: any) => {
                console.log("\n--- GENERATED PROMPT ---");
                const userMsg = params.messages.find((m: any) => m.role === 'user');
                console.log(userMsg.content);
                console.log("------------------------");

                // Return a fake valid response to not break the flow
                return {
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                repoSnapshot: { description: "Debug Run", primaryStack: "Debug", architectureType: "Feature-based", codebaseSize: "Small", activitySignal: "Actively Maintained" },
                                executiveVerdict: { maturityStage: "Prototype", maintainabilityScore: 5, maintenanceContext: "Debug", modularityStrength: "Moderate", couplingRisk: "Low", couplingContext: "Debug", refactorSafety: "Low", refactorContext: "Debug", productionReadiness: "Experimental", adoptionRecommendation: "Adopt with caution" },
                                architecturalHealth: { architectureIdentity: "Debug", pattern: "Debug", boundaryStrength: "Debug", cohesion: "Debug", consistency: "Debug" },
                                dependencyAnalysis: { centralNodes: [], topConsumers: [], circularRisk: "Low" },
                                blastRadius: { highBlastRadiusAreas: [], safeZones: [], refactorConfidence: "Low" },
                                maintainability: { centralization: "Debug", abstractionQuality: "Debug", dependencySprawl: "Debug", technicalDebtIndicators: [] },
                                executionFlow: { entryPoint: "Debug", corePath: "Debug", sideEffectZones: "Debug", stateMutationPattern: "Debug", apiBoundary: "Debug" },
                                testingProfile: { unitCoverage: "Debug", integrationDepth: "Debug", e2ePresence: "Debug", mockingStrategy: "Debug", refactorSafetyRating: "Low" },
                                scalability: { deploymentMaturity: "Debug", configHygiene: "Debug", scalingBottlenecks: "Debug", caching: "Debug" },
                                onboarding: { setupComplexity: "Low", documentationClarity: "Average", estimatedOnboardingTime: "Debug", keyFilesToRead: [], areasToAvoid: [] },
                                improvements: [],
                                finalRecommendation: { goodFor: [], riskyFor: [], recommendedApproach: "Debug" }
                            })
                        }
                    }]
                };
            }
        }
    }
};

// We need to hijack the import of 'openai' in client.ts, but that's hard in a simple script.
// Instead, I will copy the `analyzeRepo` logic here to test the prompt construction directly.

async function testPromptConstruction() {
    console.log("Fetching repo data...");
    const repoData = await getRepoData('facebook', 'react');

    // REPLICATING analyzeRepo logic from client.ts
    const prompt = `
    You are a Principal Software Architect. Your job is to perform a "Decision-Grade" technical audit of a codebase for a senior engineering team.
    
    Codebase Context:
    - Repository Name: ${repoData.name}
    - Owner: ${repoData.owner} <!-- Wait, is owner available on repoData? -->
    - Primary Language: ${repoData.language}
    - File Structure: ${JSON.stringify(repoData.tree || [], null, 2)}
    - Description: ${repoData.description || "No description provided."}

    GOAL:
    Provide a brutal... (rest of prompt)
    `;

    console.log("\n--- REPLICATED PROMPT START ---");
    console.log(prompt.substring(0, 2000)); // Print first 2000 chars
    console.log("... (truncated)");
    console.log("--- REPLICATED PROMPT END ---");

    // CHECK if owner is undefined
    console.log("repoData.owner:", repoData.owner);
}

testPromptConstruction();
