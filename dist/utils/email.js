import nodemailer from 'nodemailer';
const sendEmail = ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_POST),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        // activate in gmail less secure app option
    });
    const mailOptions = {
        from: 'hamid reza akbari <hamidwise1@gmail.com>',
        to,
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
};
export { sendEmail };
//# sourceMappingURL=email.js.map