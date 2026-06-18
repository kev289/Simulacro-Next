import cron from "node-cron";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

export const initCron = () => {
  cron.schedule("* * * * *", async () => {
    
    try {
        await transporter.sendMail({
            
        })
    } catch {

    }

  });
};