import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading env from ${envPath}`);
dotenv.config({ path: envPath });

console.log("Key available:", !!(process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY));

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

async function main() {
    try {
        console.log("Testing OpenAI connection with model: openai/gpt-4o-mini");
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: "Ping" }],
        });
        console.log("Success:", response.choices[0].message.content);
    } catch (error) {
        console.error("Failed details:", JSON.stringify(error, null, 2));
    }
}

main();
