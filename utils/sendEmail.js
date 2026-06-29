// import nodemailer from "nodemailer";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY); 
//  const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 587,
  //   secure: false,
  //   requireTLS: true,
  //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    //   connectionTimeout: 60000,
    // });
   
    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to,
    //   subject,
    //   text,
    // });
  
const sendEmail = async (to, subject, text) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    text,
  });
};

export default sendEmail;