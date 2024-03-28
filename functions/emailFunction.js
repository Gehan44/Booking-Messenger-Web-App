const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async function emailRun(mailT,mailSend) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.taximail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    function formatDate(time) {
        if (time) {
            return time.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
        } else {
            return '';
        }
    }

    let emailBody;
    if (mailT.status === 'Failed') {
        emailBody = `
        <p style="font-size: 26px;">เรียนคุณ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.dispName}</p>
        <p style="font-size: 26px;">เลขที่ใบงาน &nbsp;&nbsp;&nbsp; ${mailT.docID}</p>
        <p style="font-size: 26px;">สถานะ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: red;">ล้มเหลว</span> </p>
        <p style="font-size: 26px;">สาเหตุ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docFnote}</p>
        
        <p style="font-size: 26px;">รายละเอียด</p>
        <ul style="font-size: 25px;">
            <li>ชื่อลูกค้า/ผู้ติดต่อ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusName}</li>
            <li>รายละเอียด &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docType}${mailT.docIs}</li>
            <li>วันที่สั่งงาน &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.createdDateTime.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>วันที่นัด   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.requestDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}</li>
            <li>เวลาที่นัด    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docRound} ${formatDate(mailT.docTime)}</li>
            <li>ประเภท (ส่ง/รับ/ส่งรอรับกลับ) &nbsp;&nbsp;&nbsp; ${mailT.docSendReturn}</li>
            <li>สถานที่   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusPlace}</li>
            <li>หมายเลขโทรศัพท์ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusTel}</li>
            <li>ชื่อแมสฯ    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.userNameSend}</li>
        </ul>
        <p style="font-size: 26px;">จึงเรียนมาเพื่อทราบ</p>
    `;
    } else if (mailT.status === 'Done' || mailT.status === 'Returned') {
        emailBody = `
        <p style="font-size: 26px;">เรียน คุณ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.dispName}</p>
        <p style="font-size: 26px;">เลขที่ใบงาน &nbsp;&nbsp;&nbsp; ${mailT.docID}</p>
        <p style="font-size: 26px;">สถานะ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: green;">สำเร็จ</span> </p>
        
        <p style="font-size: 26px;">รายละเอียด</p>
        <ul style="font-size: 25px;">
            <li>ชื่อลูกค้า/ผู้ติดต่อ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusName}</li>
            <li>รายละเอียด &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docType}${mailT.docIs}</li>
            <li>วันที่สั่งงาน &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.createdDateTime.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>วันที่นัด   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.requestDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}</li>
            <li>เวลาที่นัด    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docRound} ${formatDate(mailT.docTime)}</li>
            <li>ประเภท (ส่ง/รับ/ส่งรอรับกลับ) &nbsp;&nbsp;&nbsp; ${mailT.docSendReturn}</li>
            <li>สถานที่   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusPlace}</li>
            <li>หมายเลขโทรศัพท์ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusTel}</li>
            <li>ชื่อแมสฯ    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.userNameSend}</li>
        </ul>
        <p style="font-size: 26px;">จึงเรียนมาเพื่อทราบ</p>
    `;
    } else {
        emailBody = `
        <p style="font-size: 26px;">เรียน คุณ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.dispName}</p>
        <p style="font-size: 26px;">เลขที่ใบงาน &nbsp;&nbsp;&nbsp; ${mailT.docID}</p>
        <p style="font-size: 26px;">สถานะ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.status}</p>
        
        <p style="font-size: 26px;">รายละเอียด</p>
        <ul style="font-size: 25px;">
            <li>ชื่อลูกค้า/ผู้ติดต่อ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusName}</li>
            <li>รายละเอียด &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docType}${mailT.docIs}</li>
            <li>วันที่สั่งงาน &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.createdDateTime.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>วันที่นัด   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.requestDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}</li>
            <li>เวลาที่นัด    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docRound} ${formatDate(mailT.docTime)}</li>
            <li>ประเภท (ส่ง/รับ/ส่งรอรับกลับ) &nbsp;&nbsp;&nbsp; ${mailT.docSendReturn}</li>
            <li>สถานที่   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusPlace}</li>
            <li>หมายเลขโทรศัพท์ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusTel}</li>
            <li>ชื่อแมสฯ    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.userNameSend}</li>
        </ul>
        <p style="font-size: 26px;">จึงเรียนมาเพื่อทราบ</p>
    `;
    }
    
    let info;
    if (mailSend === null) {
        info = await transporter.sendMail({
            from: 'Pine Wealth Solution Messenger no-reply@pinewealthsolution.com',
            to: `salesupport@pinewealthsolution.com`,
            subject: `เลขที่ใบงาน ${mailT.docID}`,
            html: emailBody
        });
    } else {
        info = await transporter.sendMail({
            from: 'Pine Wealth Solution Messenger no-reply@pinewealthsolution.com',
            to: `${mailSend}`,
            cc: `salesupport@pinewealthsolution.com`,
            subject: `เลขที่ใบงาน ${mailT.docID}`,
            html: emailBody
        });
    }
    console.log('Message sent: %s', info.messageId);
}