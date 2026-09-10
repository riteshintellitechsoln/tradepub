// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// type SendResult =
//   | { success: true; providerMessageId?: string }
//   | { success: false; error: string };

// export async function sendSetPasswordEmail({
//   to,
//   firstName,
//   setPasswordUrl,
// }: {
//   to: string;
//   firstName: string;
//   setPasswordUrl: string;
// }): Promise<SendResult> {
//   try {
//     const result = await resend.emails.send({
//       from: process.env.EMAIL_FROM ?? "TradeHub <onboarding@resend.dev>",
//       to,
//       subject: "Set your TradeHub password",
//       html: `
//         <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
//           <h2 style="color: #16234E;">Welcome to TradeHub, ${firstName}!</h2>
//           <p style="color: #334155; line-height: 1.6;">
//             Click the button below to set your password and finish creating your account.
//           </p>
          
//             href="${setPasswordUrl}"
//             style="display:inline-block;background:#16234E;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;"
//           >
//             Set your password
//           </a>
//           <p style="font-size:12px;color:#94a3b8;">
//             This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.
//           </p>
//         </div>
//       `,
//     });

//     if (result.error) {
//       return { success: false, error: result.error.message };
//     }

//     return { success: true, providerMessageId: result.data?.id };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to send email",
//     };
//   }
// }

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendResult =
  | { success: true; providerMessageId?: string }
  | { success: false; error: string };

export async function sendSetPasswordEmail({
  to,
  firstName,
  setPasswordUrl,
}: {
  to: string;
  firstName: string;
  setPasswordUrl: string;
}): Promise<SendResult> {
  try {
    const html =
      '<div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">' +
      '<h2 style="color: #16234E;">Welcome to TradeHub, ' + firstName + '!</h2>' +
      '<p style="color: #334155; line-height: 1.6;">Click the button below to set your password and finish creating your account.</p>' +
      '<a href="' + setPasswordUrl + '" style="display:inline-block;background:#16234E;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Set your password</a>' +
      '<p style="font-size:12px;color:#94a3b8;">This link expires in 30 minutes. If you did not request this, you can safely ignore this email.</p>' +
      '</div>';

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "TradeHub <onboarding@resend.dev>",
      to,
      subject: "Set your TradeHub password",
      html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, providerMessageId: result.data?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}