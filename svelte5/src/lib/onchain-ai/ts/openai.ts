const OPENAI_API_KEY = "";

const callOpenAI = async (content: string): Promise<string> => {
  const prompt = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Answer in plain text with few words" },
      { role: "user", content }
    ]
  };

  const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(prompt)
  });
  const data = await openAiResponse.json();
  console.log("callOpenAI ~ data:", data);

  return data.error ? data.error.message : data.choices[0].message.content;
};

export { callOpenAI };
