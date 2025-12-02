import { GoogleGenAI } from "@google/genai";
import { MOCK_CHART_DATA, BEIJING_DISTRICTS } from "../constants";

export const generateHealthReport = async (diseaseName: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare context from our mock data
    const last7Days = MOCK_CHART_DATA.slice(-7);
    const highRiskAreas = BEIJING_DISTRICTS.filter(d => d.riskLevel === 'high').map(d => d.name).join(', ');
    
    const prompt = `
      As a senior epidemiologist, analyze the following dashboard data for ${diseaseName} in Beijing.
      
      Recent Data (Last 7 Days Index):
      ${JSON.stringify(last7Days)}
      
      High Risk Districts:
      ${highRiskAreas}
      
      Please provide a concise analysis report (max 150 words) covering:
      1. The current trend (upward/downward).
      2. Key areas requiring attention.
      3. One specific actionable public health recommendation.
      
      Format the output with simple HTML tags (e.g., <strong>, <br>) for readability.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "系统繁忙，无法生成AI分析报告。请检查网络设置或API Key配置。<br/>System busy, unable to generate AI analysis.";
  }
};
