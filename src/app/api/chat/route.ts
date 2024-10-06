// import { Configuration, OpenAIApi } from "openai-edge";

// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export const runtime = "edge";

// export async function POST(req: Request) {
//     try {
//         const { messages } = await req.json();

//         const response = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo",
//             stream: true,
//             messages: messages.map((message: any) => ({
//                 content: message.content,
//                 role: message.role,
//             })),
//         });

//         // Ensure you are correctly handling the response from OpenAI
//         const responseBody = await response.json(); // Assuming response is JSON
//         return new Response(JSON.stringify(responseBody), {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Cache-Control": "no-cache",
//             },
//         });
//     } catch (error) {
//         console.error("Error handling POST request:", error);
//         return new Response("Internal Server Error", { status: 500 });
//     }
// }
