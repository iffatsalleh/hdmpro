import { prisma } from "@/lib/db/prisma";
import { COACH_TOOLS, executeCoachTool } from "@/lib/ai/tools";
import { progressService } from "@/services/progress.service";
import { knowledgeService } from "@/services/knowledge.service";
import { userService } from "@/services/user.service";
import {
  parseFoodInput,
  parseWeightInput,
  parseActivityInput,
} from "@/lib/ai/hybrid-parser";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class CoachService {
  async processMessage(userId: string, userMessage: string, conversationId?: string) {
    // 0. Pastikan rekod pengguna wujud dalam pangkalan data
    await userService.ensureUserExists(userId);

    // 1. Get or create conversation record
    let conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          title: userMessage.slice(0, 40) || "Perbualan Baru",
        },
      });
    }

    // 2. Save user message to database
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: userMessage,
      },
    });

    let responseText = "";
    let actionExecuted: { type: string; details: any } | null = null;

    // =========================================================================
    // ENJIN HIBRID PINTAR: Semak niat log (Makanan, Berat, Aktiviti, Progres)
    // 100% Tempatan, Pantas, & PERCUMA tanpa gunakan sebarang kredit OpenAI!
    // =========================================================================

    // 1. Semak Niat Log Berat Badan (cth: "berat 78.4kg", "timbang 80", "78kg")
    const parsedWeight = parseWeightInput(userMessage);
    if (parsedWeight) {
      const prevWeight = (await progressService.getMemberDashboardData(userId)).currentWeight;
      const res = await executeCoachTool("log_weight", { weight: parsedWeight.weight }, userId);
      actionExecuted = { type: "log_weight", details: res.result };

      const diff = Number((parsedWeight.weight - prevWeight).toFixed(1));
      let diffMsg = "";
      if (diff < 0) {
        diffMsg = `Turun ${Math.abs(diff)} kg berbanding bacaan sebelum ni. Padu! 🔥`;
      } else if (diff > 0) {
        diffMsg = `Naik ${diff} kg. Jangan risau, mungkin water weight atau fluktuasi glikogen. Kekal konsisten.`;
      } else {
        diffMsg = `Sama dengan bacaan sebelum ni. Teruskan momentum defisit!`;
      }

      responseText = `Dah rekod bacaan berat **${parsedWeight.weight} kg** untuk hari ini.\n\n${diffMsg}\n\n⭐ +10 XP dikreditkan!`;
    }

    // 2. Semak Niat Log Makanan / Minuman
    else {
      const parsedFood = parseFoodInput(userMessage);
      if (parsedFood) {
        const res = await executeCoachTool(
          "log_food",
          {
            mealType: parsedFood.mealType,
            description: parsedFood.description,
            calories: parsedFood.totalCalories,
            protein: parsedFood.totalProtein,
          },
          userId
        );
        actionExecuted = { type: "log_food", details: res.result };

        // Dapatkan status baki kalori terkini
        const progress = await progressService.getMemberDashboardData(userId);
        const bakiKalori = Math.max(0, progress.calorieTarget - progress.todayCalories);

        const itemsList = parsedFood.itemsDetected.map((item) => `• ${item}`).join("\n");

        responseText = `Dah selamat rekod hidangan kau ke dalam log diet! 🍽️\n\n**Makanan Dikesan:**\n${itemsList}\n\n**Makro Hidangan Ini:**\n🔥 Kalori: ~${parsedFood.totalCalories} kcal\n🥩 Protein: ~${parsedFood.totalProtein} g\n\n**Status Hari Ini:**\n• Jumlah Kalori: ${progress.todayCalories} / ${progress.calorieTarget} kcal (Baki: ${bakiKalori} kcal)\n• Jumlah Protein: ${progress.todayProtein} / ${progress.proteinTarget} g\n\n⭐ +10 XP dikreditkan ke profil kau!`;
      }

      // 3. Semak Niat Aktiviti / Senaman / Workout (cth: "workout dada", "jogging 5km")
      else {
        const parsedActivity = parseActivityInput(userMessage);
        if (parsedActivity) {
          // Rekod XP untuk aktiviti senaman
          await prisma.xPTransaction.create({
            data: {
              userId,
              amount: parsedActivity.xpEarned,
              type: "WORKOUT",
              description: `Aktiviti fizikal: ${parsedActivity.activityName}`,
            },
          });
          actionExecuted = { type: "log_activity", details: parsedActivity };

          responseText = `Hebat! Disiplin latihan macam ni yang akan bentuk badan padu. 💪\n\nRekod aktiviti: **"${parsedActivity.activityName}"** telah disimpan.\n\n⭐ +${parsedActivity.xpEarned} XP dianugerahkan atas usaha keras kau!`;
        }

        // 4. Semak Pertanyaan Progres / Baki Kalori (cth: "berapa baki kalori", "status progres")
        else if (/(progres|kemajuan|baki|status|target)/i.test(userMessage)) {
          const progress = await progressService.getMemberDashboardData(userId);
          const bakiKalori = Math.max(0, progress.calorieTarget - progress.todayCalories);
          const bakiProtein = Math.max(0, progress.proteinTarget - progress.todayProtein);

          responseText = `📊 **Ringkasan Progres HDM Semasa Kau:**\n\n• **Berat Semasa:** ${progress.currentWeight} kg\n• **Sasaran:** ${progress.targetWeight} kg (Baki: ${progress.remainingKg} kg lagi)\n• **Kemajuan Sasaran:** ${progress.progressPercentage}%\n\n**Makro Hari Ini:**\n• **Kalori:** ${progress.todayCalories} / ${progress.calorieTarget} kcal (Baki: ${bakiKalori} kcal)\n• **Protein:** ${progress.todayProtein} / ${progress.proteinTarget} g (Baki: ${bakiProtein} g)\n\nTeruskan konsistensi defisit kalori kau!`;
        }

        // 5. Soalan Umum / Nasihat: Jika ada OpenAI API Key, gunakan LLM. Jika tiada, berikan bimbingan HDM pintar.
        else {
          const apiKey = process.env.OPENAI_API_KEY;

          if (apiKey && apiKey.startsWith("sk-") && apiKey.length > 20) {
            try {
              const progress = await progressService.getMemberDashboardData(userId);
              const ragContext = await knowledgeService.getRAGContextForQuery(userMessage);

              const systemPrompt = `Anda adalah "Coach HDMPro" — pembimbing diet berkuasa AI khusus untuk metodologi Hardcore Diet Mastery (HDM).
Konteks Pengguna Semasa:
- Berat Semasa: ${progress.currentWeight} kg (Baki: ${progress.remainingKg} kg ke target ${progress.targetWeight} kg)
- Kalori Hari Ini: ${progress.todayCalories} / ${progress.calorieTarget} kcal
- Protein Hari Ini: ${progress.todayProtein} / ${progress.proteinTarget} g${ragContext}`;

              const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                  ],
                  temperature: 0.3,
                  max_tokens: 300,
                }),
              });

              const data = await res.json();
              responseText =
                data.choices?.[0]?.message?.content ||
                "Aku faham. Teruskan disiplin harian HDM kau!";
            } catch {
              responseText = this.getDefaultAdvice(userMessage);
            }
          } else {
            responseText = this.getDefaultAdvice(userMessage);
          }
        }
      }
    }

    // 4. Simpan maklum balas AI Coach ke dalam database
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: responseText,
        metadata: actionExecuted ? JSON.stringify(actionExecuted) : undefined,
      },
    });

    return {
      conversationId: conversation.id,
      response: responseText,
      action: actionExecuted,
    };
  }

  private getDefaultAdvice(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("lapar")) {
      return "Rasa lapar masa defisit tu perkara biasa — hormon ghrelin tengah bertindak balas. Tip HDM: Banyakkan minum air kosong, tambahkan sayur berdaun tinggi fiber, dan pastikan protein cukup untuk bagi rasa kenyang lebih lama.";
    }

    if (lower.includes("plateau") || lower.includes("sangkut") || lower.includes("tak turun")) {
      return "Bila berat badan sangkut lebih 2 minggu, ada 2 kemungkinan: sama ada defisit kalori kau dah terbiasa (metabolic adaptation), atau ada kalori tersembunyi (minyak masak, sos, kuah). Cuba timbang makanan lebih tepat atau buat refeed day 1 hari.";
    }

    if (lower.includes("cheat")) {
      return "Dalam HDM, kita tak sebut 'cheat meal' secara membabi buta. Sebaiknya rancang sebagai 'Refeed Day' terkawal di mana kalori dinaikkan ke paras maintenance melalui karbohidrat bersih, bukan makan makanan berminyak berlebihan.";
    }

    return "Aku Coach HDM kau. Kau boleh terus taip apa yang kau makan (cth: '2 biji telur, nasi 1 senduk, ayam grill') atau berat badan (cth: 'berat 78.2kg') atau senaman (cth: 'jogging 30 minit') — aku akan tolong kira, rekod, dan bagi XP secara automatik! 🔥";
  }
}

export const coachService = new CoachService();
