import axios from "axios";

const openaiClient = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: ``,
  },
});

export const getResponseFromOpenAI = async (prompt, messages = []) => {
  try {
    const response = await openaiClient.post("/chat/completions", {
      model: "ft:gpt-3.5-turbo-0125:personal::9lYa9cZI",
      messages: [
        ...messages,
        { role: "user", content: prompt },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting response from OpenAI:", error);
    throw error;
  }
};
