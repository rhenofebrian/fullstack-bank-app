import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Define the system prompt to give context to the AI
const systemPrompt = `
You are CBank's AI assistant, designed to help customers with banking-related questions.

About CBank:
- A security-first digital banking solution
- Offers personal and business banking services
- Provides loans, credit cards, and investment options
- Has mobile and web banking platforms

Guidelines:
1. Be helpful, professional, and concise
2. Only answer questions related to banking and financial services
3. If you don't know the answer, admit it and offer to connect the user with customer service
4. Never make up information about specific CBank products, rates, or services
5. For specific account information, direct users to log in to their account or contact customer service
6. Never ask for sensitive information like account numbers, passwords, or PINs

If you cannot answer a question with confidence, respond with: "I don't have enough information to answer that question accurately. Would you like me to connect you with our customer service team?"
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Create a new array with the system message at the beginning
    const messagesWithSystem = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Use the AI SDK to stream the response
    const result = streamText({
      model: openai("gpt-4o"),
      messages: messagesWithSystem,
    });

    // Return the streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
