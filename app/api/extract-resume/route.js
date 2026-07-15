// Triggering hot-reload for Next.js Turbopack
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract raw text from PDF using pdf-parse v1
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Define strict JSON schema
    const prompt = `
You are an expert ATS (Applicant Tracking System) parser.
Extract the following information from the provided resume text and return it strictly as JSON.
If a field cannot be found, make an educated guess or return an empty string, but always return the keys.

Fields required:
- "name": Full name of the candidate
- "fullName": Same as name
- "jobTitle": Their current or most relevant job title
- "email": Email address
- "phone": Phone number
- "college": University or College name (highest degree)
- "skillsString": A comma-separated string of all technical skills found (e.g. "React, Node.js, Python")
- "location": City, State, or Country
- "experience": A short summary of their total years of experience or current role (e.g. "3 Years" or "Senior Developer")
- "bio": Write a concise 2-sentence professional summary based on their experience and skills.
- "experiences": An array of objects, each containing: { "title": string, "company": string, "dates": string, "description": string }
- "projects": An array of objects, each containing: { "title": string, "tech": string, "description": string }
- "educations": An array of objects, each containing: { "degree": string, "school": string, "dates": string, "details": string }

Resume Text:
"""
${text}
"""
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    const jsonData = JSON.parse(resultText);
    
    // Ensure arrays exist to prevent mapping errors in frontend
    jsonData.experiences = jsonData.experiences || [];
    jsonData.projects = jsonData.projects || [];
    jsonData.educations = jsonData.educations || [];

    return NextResponse.json({ success: true, data: jsonData });
    
  } catch (error) {
    console.error("Resume Extraction Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process resume', stack: error.stack }, { status: 500 });
  }
}
