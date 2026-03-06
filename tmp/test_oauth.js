const { Client, Account, OAuthProvider } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

async function testOAuth() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY || ''); // Admin key needed for node SDK

    const account = new Account(client);

    // Test parameters
    const redirectUrl = 'http://localhost:3000/auth/google-callback';

    console.log('Testing OAuth Token Generation...');
    try {
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${redirectUrl}?success=true`,
            `${redirectUrl}?failure=true`
        );
        console.log('✅ SUCCESS! Generated Login URL:', loginUrl);
    } catch (error) {
        console.error('❌ FAILED to generate Token:', {
            message: error.message,
            code: error.code
        });
        if (error.message.includes('API key')) {
            console.log('NOTE: Verification requires a valid APPWRITE_API_KEY in .env.local to test via script.');
        }
    }
}

testOAuth();
