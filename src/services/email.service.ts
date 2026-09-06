import { brevoClient, BrevoClient } from "@/lib/email/brevo";

export class EmailService {
  constructor(private client: BrevoClient = brevoClient) {}

  async sendWelcomeEmail(toEmail: string, name: string) {
    return this.client.sendEmail({
      to: [{ email: toEmail, name }],
      subject: "Selamat Datang ke HDMPro — Misi Transformasi Bermula! 🔥",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color: #090b0e; color: #f3f4f6; padding: 24px; border-radius: 12px;">
          <h1 style="color: #e63946; margin-bottom: 8px;">Selamat Datang, ${name}!</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #9ca3af;">
            Tahniah kerana mengambil langkah berani menyertai platform Hardcore Diet Mastery Pro (HDMPro).
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #9ca3af;">
            Mulai hari ini, anda boleh mencatat makanan harian, menimbang berat badan, dan bercakap terus dengan AI Coach anda untuk bimbingan peribadi 24/7.
          </p>
          <div style="margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
               style="background-color: #e63946; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
              Masuk ke Dashboard Sekarang
            </a>
          </div>
          <p style="margin-top: 32px; font-size: 12px; color: #6b7280;">
            Disiplin membina hasil sebenar. — Pasukan HDMPro
          </p>
        </div>
      `,
    });
  }

  async sendSubscriptionConfirmationEmail(toEmail: string, name: string, planName: string) {
    return this.client.sendEmail({
      to: [{ email: toEmail, name }],
      subject: "Pengesahan Keahlian HDMPro — Akses Penuh Diaktifkan ⚡",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color: #090b0e; color: #f3f4f6; padding: 24px; border-radius: 12px;">
          <h1 style="color: #e63946;">Keahlian Diaktifkan!</h1>
          <p style="font-size: 14px; color: #9ca3af;">
            Hai ${name}, pembayaran anda untuk <strong>${planName}</strong> telah berjaya disahkan.
          </p>
          <p style="font-size: 14px; color: #9ca3af;">
            Semua kelebihan premium termasuk AI Coach tanpa had, pangkalan RAG HDM, dan modul lanjutan kini sedia untuk anda gunakan.
          </p>
        </div>
      `,
    });
  }

  async sendModuleCompletionEmail(toEmail: string, name: string, moduleTitle: string) {
    return this.client.sendEmail({
      to: [{ email: toEmail, name }],
      subject: `Tahniah! Anda Selesai Modul: ${moduleTitle} 🎓`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background-color: #090b0e; color: #f3f4f6; padding: 24px; border-radius: 12px;">
          <h2 style="color: #e63946;">Satu Lagi Langkah Maju!</h2>
          <p style="font-size: 14px; color: #9ca3af;">
            Tahniah ${name}, anda telah berjaya menamatkan semua pelajaran dalam <strong>${moduleTitle}</strong>.
          </p>
          <p style="font-size: 14px; color: #9ca3af;">
            +25 XP telah dikreditkan ke dalam akaun anda. Teruskan momentum ini!
          </p>
        </div>
      `,
    });
  }
}

export const emailService = new EmailService();
