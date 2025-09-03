import crypto from 'crypto';
import { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";
import { AppDataSource } from '../database/migration/data-source';
import { LinkToken } from '../database/entity/Token';
import { transporter } from '../config';
import { linkTokenRepository } from '../../modules/link-token/link-token.repository';
dotenv.config();


export function generateToken() {
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date( Date.now() + (30 * 60 * 1000)); // 30 minutes

    return { token, expiresAt };
  }


export async function sendPasswordResetLink(email: string): Promise<SentMessageInfo> {
 const {token, expiresAt} = generateToken();
 const resetPasswordLink = `${process.env.BASE_URL || 'http://localhost:5050'}/api/v1/auth/reset-password/${token}`;
 const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      text: `Please click on the following link to reset your password: ${resetPasswordLink}`,
    };
    try{

  await linkTokenRepository.create({
    token,
    email,
    expiresAt
  });
  return transporter.sendMail(mailOptions);

    } catch (error) {
        console.error({
            success: false,
            status: 500,
            message: error
        });
        return error;
    }




}
export async function verifyToken(token: string): Promise<boolean> {
  try{
    const tokenData = await AppDataSource.manager.findOne(LinkToken, { where: { token } });
    if (tokenData) {
      if (tokenData.isExpired) {
        return false;
    }
      return true;
    }
    return false;
  } catch (error) {
    console.error({
        success: false,
        status: 500,
        message: error
    });
    return false;
  }
}