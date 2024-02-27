const nodemailer = require('nodemailer');

module.exports = async function emailRun(mailSend,mailT) {
    if (typeof mailT === 'object') {
        mailT = JSON.stringify(mailT);
    }
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'gehan.dube@bumail.net',
            pass: 'DubeBu2020'
        }
    });

    let info = await transporter.sendMail({
        from: 'gehan.dube@bumail.net',
        to: mailSend,
        subject: 'จากระบบ Booking Messenger Web App',
        text: mailT,
    });
    console.log('Message sent: %s', info.messageId);
}