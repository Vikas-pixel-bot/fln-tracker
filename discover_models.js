const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function run() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("Checking available models for key...");

  const genAI = new GoogleGenerativeAI(key);

  try {
    // Note: The SDK doesn't expose listModels directly on the main class in all versions
    // We can try to fetch a generic model to see if the connection works
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Attempting call to 'gemini-pro' (stable model)...");
    const result = await model.generateContent("test");
    const response = await result.response;
    console.log("Success with 'gemini-pro'!");
  } catch (error) {
    console.error("Error with 'gemini-pro':", error.message);
    
    // Attempting a raw fetch to list models to see what is actually there
    const fetch = require('node-fetch');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
        } else {
            console.log("No models returned. Response:", JSON.stringify(data, null, 2));
        }
    } catch (fetchErr) {
        console.error("Failed to fetch model list:", fetchErr.message);
    }
  }
}

run();
