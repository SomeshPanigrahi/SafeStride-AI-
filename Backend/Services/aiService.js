
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateAIExplanation = async (data) => {
  try {
    const { acuteLoad, chronicLoad, acwr, riskLevel } = data;

  
    
    if (acwr > 1.5) {
      return "Load spike detected — high injury risk. Reduce intensity and recover for a few days.";
    }

    if (acwr < 0.8) {
      return "Training load is low. You can safely increase intensity gradually.";
    }

    
    //SMART PROMPT
  
    const prompt = `
You are a professional running coach.

ACWR: ${acwr.toFixed(2)}
Risk: ${riskLevel}

Give a SHORT coaching message.

Rules:
- Max 2–3 sentences
- No theory or definitions
- Be direct and actionable
- Sound human, not technical

Examples:
"You're pushing too hard. Ease off for a few days."
"Good balance. Maintain your current training."

Now generate the response:
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    // 🧹 POST-PROCESSING
    
    let text = response.choices[0].message.content;

    // 1. Remove extra spaces
    text = text.trim();

    // 2. Remove numbering (1. 2. etc)
    text = text.replace(/^\d+\.\s*/gm, "");

    // 3. Convert multi-line → single clean line
    text = text.split("\n").slice(0, 3).join(" ");

    // 4. Hard length limit
    if (text.length > 180) {
      text = text.slice(0, 180) + "...";
    }

    // 5. Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    return text;

  } catch (error) {
    console.error("AI ERROR:", error.message);

    
    
  
    return "Training load is changing. Keep intensity balanced and avoid sudden spikes.";
  }
};

module.exports = { generateAIExplanation };