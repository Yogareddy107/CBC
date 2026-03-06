import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import { getRepoData } from '../src/lib/github/client';

async function main() {
    try {
        const owner = 'facebook';
        const repo = 'react';
        console.log(`Fetching data for ${owner}/${repo}...`);

        const data = await getRepoData(owner, repo);

        console.log("--- Repo Data ---");
        console.log("Name:", data.name);
        console.log("Description:", data.description);
        console.log("Tree Length:", data.tree ? data.tree.length : "UNDEFINED");
        if (data.tree && data.tree.length > 0) {
            console.log("First 5 files:", data.tree.slice(0, 5));
        } else {
            console.warn("WARNING: Tree is empty or undefined!");
        }

    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

main();
