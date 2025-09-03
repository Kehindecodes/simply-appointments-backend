import { SentMessageInfo } from "nodemailer";
import {transporter} from "../config";
import dotenv from "dotenv";
import { AppValidationError } from "../../errors/AppValidationError";
dotenv.config();



export const generateOTP = (): string => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const senderEmail = process.env.EMAIL_USERNAME;

export const sendOTP = async (otp: string, email: string): Promise<SentMessageInfo> => {
  if (!senderEmail) {
    throw new AppValidationError("sender email not found");
  }
  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };
  try{
       const info =  await transporter.sendMail(mailOptions);
      console.log(`OTP sent successfully to ${email}`);
      return info;
  } catch (error) {
      console.error("Error sending OTP: ", error);
      throw error;
  }
}