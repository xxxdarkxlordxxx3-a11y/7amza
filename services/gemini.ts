import { GoogleGenAI } from "@google/genai";

// (اختياري) يمكن إعادة تفعيل توليد النصوص لاحقاً لو حبيت
export const generateBlogContent = async (topic: string): Promise<string> => {
    return "AI generation for text is currently disabled.";
};

export const generateImage = async (prompt: string, aspectRatio: string = "16:9", imageSize: string = "1K"): Promise<string | null> => {
  // بنعمل انستانس جديد عشان نضمن اننا بنستخدم أحدث مفتاح API من الـ context
  // This ensures we pick up the key if the user just selected it via window.aistudio
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use Gemini 2.5 Flash Image for standard 1K requests (Faster, Cheaper/Free)
  // Use Gemini 3 Pro Image for 2K/4K (Requires Paid Plan/Billing)
  const isHighQuality = imageSize === '2K' || imageSize === '4K';
  const model = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  const config: any = {};
  
  if (isHighQuality) {
      config.imageConfig = {
          aspectRatio: aspectRatio,
          imageSize: imageSize
      };
  } else {
      // 2.5 Flash Image supports aspectRatio but NOT imageSize parameter
      config.imageConfig = {
          aspectRatio: aspectRatio
      };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: config,
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    // Log the error for debugging in the console
    console.error("Gemini API Error in generateImage:", error);
    // Re-throw to be handled by the UI
    throw error;
  }
};