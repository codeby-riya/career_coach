"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

// Retries transient errors (e.g. 503 "model overloaded") with backoff
async function generateWithRetry(prompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      const isOverloaded =
        error?.status === 503 || /overloaded|unavailable/i.test(error?.message || "");
      if (isOverloaded && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
}


export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.

    Candidate contact details (use these EXACT values verbatim in the letterhead —
    do NOT output placeholder text like "[Your Name]" or "[Your Email Address]"):
    - Full Name: ${user.name || "Applicant"}
    - Email: ${user.email}
    ${data.phone ? `- Phone: ${data.phone}` : ""}
    ${data.linkedin ? `- LinkedIn/Portfolio: ${data.linkedin}` : ""}

    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown, starting with the
       candidate's name, email, ${data.phone ? "phone, " : ""}and today's date
       as the letterhead — using the exact values given above, never bracketed
       placeholders
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await generateWithRetry(prompt);
    const rawContent = result.response.text().trim();

    // Markdown collapses single line breaks into a space. The letterhead
    // (name/email/phone/date block) relies on real line breaks, so we add a
    // hard break ("  " + newline) to every line that's immediately followed
    // by another non-blank line (i.e. not already separated by a blank line).
    const content = rawContent
      .split("\n")
      .map((line, idx, arr) => {
        const nextLine = arr[idx + 1];
        const isMidBlock =
          line.trim() !== "" && nextLine !== undefined && nextLine.trim() !== "";
        return isMidBlock ? line.replace(/\s+$/, "") + "  " : line;
      })
      .join("\n");

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    const isOverloaded =
      error?.status === 503 || /overloaded|unavailable/i.test(error?.message || "");
    throw new Error(
      isOverloaded
        ? "The AI model is currently overloaded. Please try again in a moment."
        : "Failed to generate cover letter"
    );
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}