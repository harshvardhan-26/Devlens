import { generateText } from "./gemini.service.js";

export async function generateMentorSummary(projects) {
  const projectData = projects.map((p) => ({
    projectName: p.projectName,
    score: p.feedback?.score || p.score,
    strengths: p.feedback?.strengths || [],
    weaknesses: p.feedback?.weaknesses || [],
    architecture: p.feedback?.architecture || "",
    codeQuality: p.feedback?.codeQuality || ""
  }));

  const prompt = `
You are an experienced Senior Software Engineer and Technical Mentor.

Analyze this developer's complete project history.

${JSON.stringify(projectData, null, 2)}

Return ONLY valid JSON:

{
  "level": "",
  "portfolioRating": "",
  "strengths": [],
  "growthAreas": [],
  "mentorSummary": "",
  "careerAdvice": "",
  "nextMilestone": "",
  "learningRoadmap": []
}
`;

  const result = await generateText(prompt);

  return JSON.parse(result);
}