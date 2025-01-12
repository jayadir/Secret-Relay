import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
export const POST=async (req:Request)=>{
    try {
        const prompt="Generate a message for a customer who wants to cancel their subscription."
        const result = streamText({
            model: google('gemini-1.5-pro-latest'),
            system: 'You are a helpful assistant.',
            prompt: prompt,
            maxTokens: 500,
          });
        
          return result.toDataStreamResponse();
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Failed to generate message" }, { status: 500 });
    }
}