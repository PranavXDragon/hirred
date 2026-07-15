import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    // Since we are using standard Gemini 1.5 Pro to analyze the visual layout of a PDF, 
    // we need to pass the file as inline data or upload it using the File API.
    // The @google/genai client accepts inline data.

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert Frontend Developer and Designer. I am providing you with a PDF of a resume.
      Your task is to analyze the VISUAL LAYOUT, COLORS, and FONTS of this resume, and generate a dynamic HTML/CSS template configuration for our React Resume Builder application.
      
      Our application has a CV preview pane built with Tailwind CSS. It uses the following base templates: 'brutalist', 'minimalist', 'corporate', 'monotech'.
      
      Determine the closest matching 'template' (base structure).
      Determine the dominant 'accent' color (as a hex code).
      Determine the closest matching 'font' from these options: 'font-sans', 'font-serif', 'font-mono'.
      
      CRITICAL: You must also generate 'custom_css' which contains raw CSS rules to perfectly replicate any unique structural elements, borders, backgrounds, or specific spacing seen in the PDF that our base template doesn't cover. Target the #cv-print-area div and its children. Make it specific enough to override default Tailwind classes if needed. Do NOT include html/body tags, only CSS rules for the resume container.
      
      Respond strictly in the following JSON format without any markdown wrappers (do not use \`\`\`json):
      {
        "template": "minimalist",
        "accent": "#2c3e50",
        "font": "font-sans",
        "custom_css": "#cv-print-area { ... } .section-title { ... }"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: Buffer.from(buffer).toString('base64'),
                mimeType: file.type || 'application/pdf',
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('No response from AI.');
    }

    // Try parsing the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(textOutput);
    } catch (e) {
      // Cleanup markdown if AI accidentally included it
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
