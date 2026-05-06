import model from "../config/gemini.js";
import AppError from "../utils/AppError.js";


// first checking the content and creating a prompt for the gemini model

export const analyzeContentFromNote = async (content) => {
    if (!content || content.trim() === "") {
        throw new AppError("No content provided", 400);
    }

    // a precise prompt for gemini model to get the required data in specific format  
    const prompt = `
Analyze the following note and return ONLY valid JSON.

Required JSON format:

{
  "summary": "short concise summary",
  "tags": ["tag1", "tag2"],
}

Rules:
- Return only JSON
- No markdown
- No explanation
- No extra text
- Tags must be short and specific
- If no action items exist, return empty array []

Note Content:
${content}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const parsedData = JSON.parse(text);

        console.log("Gemini Response:", parsedData);

        return {
            summary: parsedData.summary || "The summary is not available.",
            tags: parsedData.tags || [],
        };

    } catch (error) {
        console.error("Gemini Error:", error);

        throw new AppError("Failed to analyze the note", 500);
    }
};