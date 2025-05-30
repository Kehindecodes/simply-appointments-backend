import { SentMessageInfo } from "nodemailer";
import {transporter} from "../config";
import dotenv from "dotenv";
dotenv.config();



export const generateOTP = (): string => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };


  export const sendOTP = async (otp: string, email: string): Promise<SentMessageInfo> => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
    }
    }