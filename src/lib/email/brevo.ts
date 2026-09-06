export interface SendEmailPayload {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
}

export class BrevoClient {
  private apiKey: string | undefined;
  private senderEmail: string;
  private senderName: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@hdmpro.app";
    this.senderName = process.env.BREVO_SENDER_NAME || "HDMPro";
  }

  async sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; messageId?: string }> {
    if (!this.apiKey || !this.apiKey.startsWith("xkeysib-")) {
      console.log("[Brevo Dev Fallback] Email would be sent to:", payload.to, "Subject:", payload.subject);
      return { success: true, messageId: "dev-simulated-id" };
    }

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify({
          sender: { name: this.senderName, email: this.senderEmail },
          to: payload.to,
          subject: payload.subject,
          htmlContent: payload.htmlContent,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Brevo API Error:", errText);
        return { success: false };
      }

      const data = await res.json();
      return { success: true, messageId: data.messageId };
    } catch (err: any) {
      console.error("Brevo Send Failed:", err.message);
      return { success: false };
    }
  }
}

export const brevoClient = new BrevoClient();
