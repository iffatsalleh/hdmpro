import { NextResponse } from "next/server";
import { coachService } from "@/services/coach.service";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "demo-member-id";

    const body = await req.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Mesej tidak boleh kosong.",
          },
        },
        { status: 400 }
      );
    }

    const result = await coachService.processMessage(
      userId,
      parsed.data.message,
      parsed.data.conversationId
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Coach Chat API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error?.message || "Ralat memproses perbualan AI Coach.",
        },
      },
      { status: 500 }
    );
  }
}
