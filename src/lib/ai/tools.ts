import { dietService } from "@/services/diet.service";
import { weightService } from "@/services/weight.service";
import { progressService } from "@/services/progress.service";
import type { MealType } from "@prisma/client";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const COACH_TOOLS: ToolDefinition[] = [
  {
    name: "log_food",
    description: "Merekod makanan/minuman yang diambil pengguna ke dalam pangkalan data diet.",
    parameters: {
      type: "object",
      properties: {
        mealType: {
          type: "string",
          enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "DRINK", "OTHER"],
          description: "Waktu hidangan",
        },
        description: {
          type: "string",
          description: "Nama dan perincian makanan atau minuman",
        },
        calories: {
          type: "number",
          description: "Anggaran jumlah kalori dalam kcal",
        },
        protein: {
          type: "number",
          description: "Anggaran jumlah protein dalam gram (g)",
        },
        carbohydrates: {
          type: "number",
          description: "Anggaran karbohidrat dalam gram (g) jika ada",
        },
        fat: {
          type: "number",
          description: "Anggaran lemak dalam gram (g) jika ada",
        },
      },
      required: ["mealType", "description", "calories", "protein"],
    },
  },
  {
    name: "log_weight",
    description: "Merekod bacaan timbangan berat badan pengguna ke dalam pangkalan data.",
    parameters: {
      type: "object",
      properties: {
        weight: {
          type: "number",
          description: "Bacaan berat badan dalam kg (cth: 78.4)",
        },
        notes: {
          type: "string",
          description: "Catatan tambahan (cth: timbang selepas bangun tidur)",
        },
      },
      required: ["weight"],
    },
  },
  {
    name: "get_today_progress",
    description: "Mendapatkan ringkasan kalori, protein, sasaran, dan kemajuan hari ini untuk pengguna.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_weight_history",
    description: "Mendapatkan rekod sejarah timbangan berat badan pengguna yang lalu.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Bilangan rekod terkini untuk diambil (default 5)",
        },
      },
    },
  },
];

export async function executeCoachTool(
  toolName: string,
  args: Record<string, any>,
  userId: string
): Promise<{ success: boolean; result: unknown; actionTaken?: string }> {
  try {
    switch (toolName) {
      case "log_food": {
        const log = await dietService.logFood({
          userId,
          mealType: (args.mealType as MealType) || "OTHER",
          description: args.description,
          calories: Number(args.calories) || 0,
          protein: Number(args.protein) || 0,
          carbohydrates: Number(args.carbohydrates) || 0,
          fat: Number(args.fat) || 0,
          source: "AI",
        });
        return {
          success: true,
          actionTaken: "LOG_FOOD",
          result: {
            id: log.id,
            description: log.description,
            calories: log.calories,
            protein: log.protein,
            mealType: log.mealType,
          },
        };
      }

      case "log_weight": {
        const weight = Number(args.weight);
        const log = await weightService.logWeight({
          userId,
          weight,
          notes: args.notes,
          source: "AI",
        });
        return {
          success: true,
          actionTaken: "LOG_WEIGHT",
          result: {
            id: log.id,
            weight: log.weight,
            date: log.date,
          },
        };
      }

      case "get_today_progress": {
        const data = await progressService.getMemberDashboardData(userId);
        return {
          success: true,
          result: data,
        };
      }

      case "get_weight_history": {
        const limit = Number(args.limit) || 5;
        const history = await weightService.getWeightHistory(userId, limit);
        return {
          success: true,
          result: history.map((h) => ({ weight: h.weight, date: h.date })),
        };
      }

      default:
        return { success: false, result: `Tool '${toolName}' tidak dikenali.` };
    }
  } catch (error: any) {
    return {
      success: false,
      result: error?.message || "Ralat semasa menjalankan operasi data.",
    };
  }
}
