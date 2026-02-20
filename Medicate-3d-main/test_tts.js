const https = require('https');

const fs = require('fs');
const path = require('path');

// Try to load from .env if not in process.env
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_GOOGLE_AI_API_KEY=(.*)/);
    if (match) {
        process.env.VITE_GOOGLE_AI_API_KEY = match[1].trim();
        console.log("Loaded API KEY from .env file");
    }
}

const API_KEY = process.env.VITE_GOOGLE_AI_API_KEY || "YOUR_API_KEY_HERE";
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const data = JSON.stringify({
    input: { text: "Hello, this is a test." },
    voice: { languageCode: "en-US", name: "en-US-Standard-A" },
    audioConfig: { audioEncoding: "MP3" }
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("Testing TTS API...");

const req = https.request(url, options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response Body:");
        console.log(responseBody);
    });
});

req.on('error', (error) => {
    console.error("Error:", error);
});

req.write(data);
req.end();
