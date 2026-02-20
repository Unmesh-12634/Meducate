const https = require('https');

const fs = require('fs');
const path = require('path');

// Try to load from .env if not in process.env
if (!process.env.VITE_GOOGLE_AI_API_KEY) {
    try {
        const envPath = path.resolve(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/VITE_GOOGLE_AI_API_KEY=(.*)/);
            if (match) {
                process.env.VITE_GOOGLE_AI_API_KEY = match[1].trim();
                console.log("Loaded API KEY from .env file");
            }
        }
    } catch (e) {
        console.log("Could not read .env file");
    }
}

const API_KEY = process.env.VITE_GOOGLE_AI_API_KEY || "YOUR_API_KEY_HERE";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log("No models found or error:", data);
            }
        } catch (e) {
            console.log("Error parsing JSON:", e);
            console.log("Raw Data:", data);
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
