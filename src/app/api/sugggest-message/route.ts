import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, generateText } from 'ai';

export const maxDuration = 2;


// currently i dont have aceess of any models if you have any api key you can use it
export async function POST(req: Request) {
    try {
        
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
        
        const result = await generateText({
            model: openai('gpt-3.5-turbo'),
            maxTokens: 100,
            prompt: prompt,
        });

        return Response.json(
            {
                message:"fetched successfully",
                success: true,
                data: result
            },
            {
                status: 200
            }
        )
    } catch (error) {
        //console.log(error);  // uncomment this if you want to see the error in the console
        return Response.json(
            {
                message: "Something went wrong in Suggesting the message",
                success: false,
                data: null
            },
            {
                status: 500
            });
    }
}
