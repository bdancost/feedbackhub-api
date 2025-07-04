import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER, // seu e-mail
    pass: process.env.EMAIL_PASS, // senha de app gerada no Gmail
  },
});

export async function sendFeedbackEmail(to: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Obrigado pelo seu feedback!",
    text: `Obrigado por sua opinião, ${name}!`,
  };

  return transporter.sendMail(mailOptions);
}
