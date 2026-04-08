const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function run() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("Testing with Key starting with:", key?.substring(0, 10));

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log("Attempting simple prompt...");
    const result = await model.generateContent("Hello, are you active?");
    const response = await result.response;
    const text = response.text();
    console.log("AI Response Success:", text);
  } catch (error) {
    console.error("AI FATAL ERROR DETAILS:");
    console.error("Status Code:", error.status);
    console.error("Error Message:", error.message);
    if (error.response) {
      console.error("Raw Response:", JSON.stringify(error.response, null, 2));
    }
  }
}

run();
