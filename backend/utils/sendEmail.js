
const nodeMailer = require("nodemailer");

const sendEmail = async (options) =>{

    const transporter = nodeMailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        auth:{
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;





// const nodeMailer = require("nodemailer");
// require('dotenv').config(); // Import ở đầu file để load các biến môi trường

// const sendEmail = async (options) => {
//     const transporter = nodeMailer.createTransport({
//         service: process.env.SMTP_SERVICE,
//         auth: {
//             user: process.env.SMTP_MAIL,
//             pass: process.env.SMTP_PASSWORD,
//         },
//         tls: {
//             // Cài đặt TLS nếu cần
//             rejectUnauthorized: false // Cần thiết trong môi trường phát triển, nhưng không nên được sử dụng trong môi trường sản xuất
//         }
//     });

//     const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${options.email} successfully`); // Log khi gửi email thành công
//     } catch (error) {
//         console.error(`Error sending email: ${error}`);
//         throw new Error(`Error sending email: ${error}`);
//     }
// };

// module.exports = sendEmail;
