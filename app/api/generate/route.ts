import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


export async function POST(request: NextRequest) {

    try {
        const { prompt } = await request.json();

    if(!prompt) {
        return NextResponse.json({ error: "Prompt is required" }, {status: 400})
    }

    const input = {
        prompt,
        output_format: 'jpg'
    }

    const output = await replicate.run("google/gemini-2.5-flash-image", { input });
console.log('Output:', output);
    // get the output url

    const outputUrl = (output as any).url();

    return NextResponse.json({ success: true, output: outputUrl, message: "Image generated successfully"}, {status: 200});

    } catch (error) {
        return NextResponse.json({ error: "Failed to generate image" }, {status: 500});
    }
}