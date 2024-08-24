import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { string } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY || '');
console.log(process.env.GENERATIVE_AI_API_KEY)

async function geminiContent(prompt: string) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let content = response.text();
  content = content.replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>");
  // console.log(content);
  return content;
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  
  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qoph.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  const geminiStream = await geminiContent(prompt)
  console.log(geminiStream)
    

  // Convert the response into a friendly text-stream
  // const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return Response.json({
    success:false,
    message: {geminiStream}
    },{
        status:404
    })
}



// pages/api/generate.ts (or .js if you're not using TypeScript)
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

// // Initialize the GoogleGenerativeAI instance
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// // Function to generate content using the Gemini model
// async function geminiContent(prompt: string) {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//   const result = await model.generateContent(prompt);
//   return result.response;
// }

// // Function to build the Google GenAI prompt from Vercel AI SDK messages
// const buildGoogleGenAIPrompt = (messages: Message[]) => ({
//   contents: messages
//     .filter(message => message.role === 'user' || message.role === 'assistant')
//     .map(message => ({
//       role: message.role === 'user' ? 'user' : 'model',
//       parts: [{ text: message.content }],
//     })),
// });

// // The POST handler for the API route
// export async function POST(req: Request) {
//   try {
//     // Extract messages from the request body
//     const { messages } = await req.json();
    
//     // Define the prompt
//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qoph.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    
//     // Generate content using the Gemini model
//     const geminiContentResponse = await geminiContent(prompt);
    
//     // Convert the response to a stream
//     const geminiStream = GoogleGenerativeAIStream({ stream: geminiContentResponse });
    
//     // Respond with the streaming text response
//     return new StreamingTextResponse(geminiStream);
//   } catch (error) {
//     console.error("Error while generating messages:", error);
//     throw error;
//   }
// }
