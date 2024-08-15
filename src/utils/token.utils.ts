import crypto from 'crypto';
import { SentMessageInfo } from "nodemailer";
import transporter from "../services/nodemailer-config";
import dotenv from "dotenv";
import { AppDataSource } from '../migration/data-source';
import { Token } from 'aws-sdk';
import { LinkToken } from '../entity/Token';
import { errorHandler } from '../httpResponse-handler/errorHandler';
dotenv.config();


export function generateToken() {
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date( Date.now() + (30 * 60 * 1000)); // 30 minutes
  
    return { token, expiresAt };
  }


export async function sendPasswordResetLink(email: string): Promise<SentMessageInfo> {
 const {token, expiresAt} = generateToken();
 const restPasswordLink = `http://localhost:5050/api/v1/users/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      text: `Please click on the following link to reset your password: ${restPasswordLink}`,
    };
    try{
  // save Token to database
  const tokenData = new LinkToken();
  tokenData.token = token;
  tokenData.email = email;
  tokenData.expiresAt = expiresAt;
  await AppDataSource.manager.save(tokenData);
  return transporter.sendMail(mailOptions);

    } catch (error) {
        console.error({
            success: false,
            status: 500,
            message: error
        });
    }
  


    
}

export async function verifyToken(token: string): Promise<boolean> {
  try{
    const tokenData = await AppDataSource.manager.findOne(LinkToken, { where: { token } });
    if (tokenData){
      if (Date.now() > tokenData.getExpiresAt?.getTime()) {
        return false; ;
      }
    }
    return true;
  } catch (error) {
    console.error({
        success: false,
        status: 500,
        message: error
    });
    return false; 
  }
    
  }