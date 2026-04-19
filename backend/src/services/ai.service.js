const axios = require("axios");

async function generateAIResponse(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    console.error("AI ERROR STATUS:", err.response?.status);
    return null; // fallback trigger
  }
}

module.exports = { generateAIResponse };
