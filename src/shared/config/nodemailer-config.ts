import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL_USERNAME and EMAIL_PASSWORD environment variables are required');
}

const transporter = nodemailer.createTransport({
   service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,

    },
});

export {
    transporter
};
