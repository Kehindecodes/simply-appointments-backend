import { SentMessageInfo } from "nodemailer";
import {transporter} from "../config";
import dotenv from "dotenv";
dotenv.config();


export const sendBookingConfirmation = async (userName: string, date: Date, time: Date, serviceName: string, staffName: string, email: string): Promise<SentMessageInfo> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Appointment Confirmation",
        html: `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h1 { color: #4a4a4a; }
                    .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
                    .detail-item { margin-bottom: 10px; }
                    .detail-label { font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Appointment Confirmation</h1>
                    <p>Hello ${userName},</p>
                    <p>Your appointment has been confirmed. Here are your appointment details:</p>
                    <div class="details">
                        <div class="detail-item"><span class="detail-label">Service:</span> ${serviceName}</div>
                        <div class="detail-item"><span class="detail-label">Attendant:</span> ${staffName}</div>
                        <div class="detail-item"><span class="detail-label">Appointment Date:</span> ${date}</div>
                        <div class="detail-item"><span class="detail-label">Appointment Time:</span> ${time}</div>
                    </div>
                    <p>We look forward to seeing you!</p>
                </div>
            </body>
        </html>
        `,
    };
    try{
        const info = await transporter.sendMail(mailOptions);
        console.log(`Appointment confirmation sent to ${email}`);
        return info;
    } catch (error) {
        console.error("Error sending appointment confirmation: ", error);
    }

}