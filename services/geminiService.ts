import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the response schema for strict JSON output
const recipeSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      cookingTime: { type: Type.STRING },
      difficulty: { type: Type.STRING },
      calories: { type: Type.STRING },
      usedIngredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of ingredients from the user's input used in this recipe"
      },
      missingIngredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of ingredients the user needs to buy"
      },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Step-by-step cooking instructions"
      }
    },
    required: ["id", "name", "description", "cookingTime", "difficulty", "missingIngredients", "steps", "usedIngredients", "calories"]
  }
};

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("Vui lòng cấu hình API Key để sử dụng tính năng này.");
  }

  if (ingredients.length === 0) {
    return [];
  }

  const prompt = `
    Tôi có những nguyên liệu này trong tủ lạnh: ${ingredients.join(", ")}.
    Hãy gợi ý cho tôi 3-5 món ăn ngon có thể nấu từ những nguyên liệu này (có thể thêm gia vị cơ bản hoặc vài nguyên liệu phụ phổ biến nếu cần, nhưng hãy ưu tiên dùng đồ đang có).
    
    Hãy sáng tạo và đưa ra hướng dẫn nấu ăn chi tiết bằng tiếng Việt.
    Độ khó nên đa dạng (Dễ, Trung bình).
    Ước lượng calo cho mỗi khẩu phần.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "Bạn là một đầu bếp chuyên nghiệp và thân thiện. Nhiệm vụ của bạn là giúp người dùng nấu ăn ngon từ những gì họ có sẵn. Phản hồi hoàn toàn bằng Tiếng Việt.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Không nhận được dữ liệu từ Gemini.");
    }

    const recipes = JSON.parse(jsonText) as Recipe[];
    
    // Ensure IDs are unique if the AI returns generic ones, though we asked for strings.
    // Adding a timestamp suffix just in case.
    return recipes.map((r, index) => ({
        ...r,
        id: `${r.id || 'recipe'}-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Có lỗi xảy ra khi gọi trợ lý ảo. Vui lòng thử lại sau.");
  }
};