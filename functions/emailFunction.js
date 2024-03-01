const sendmail = require('sendmail')();

module.exports = async function emailRun(mailSend, mailT) {
    console.log("Program Email Start")
    let emailBody;
    if (mailT.status === 'Failed') {
        emailBody = `
        <p style="font-size: 26px;">เรียน คุณ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.dispName},</p>
        <p style="font-size: 26px;">เลขที่พัสดุ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docID}</p>
        <p style="font-size: 26px;">สถานะการนำส่ง &nbsp; <span style="color: red;">ล้มเหลว</span> </p>
        <p style="font-size: 26px;">สาเหตุ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docFnote}</p>
        
        <p style="font-size: 26px;">รายละเอียด</p>
        <ul style="font-size: 25px;">
            <li>ชื่อลูกค้า/ผู้ติดต่อ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusName}</li>
            <li>รายละเอียดเอกสาร &nbsp;&nbsp; ${mailT.docType}${mailT.docIs}</li>
            <li>วันที่สั่งงาน &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.createdDateTime.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>วันที่นัด   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.requestDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}</li>
            <li>เวลาที่นัด    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docRound} ${mailT.docTime.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>ประเภท (รับ/ส่ง) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docSendReturn}</li>
            <li>สถานที่   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusPlace}</li>
            <li>หมายเลขโทรศัพท์ &nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusTel}</li>
            <li>นำส่งโดย    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.userNameSend}</li>
        </ul>
        <p style="font-size: 26px;">จึงเรียนมาเพื่อทราบ</p>
        <img class="d-block mx-auto mb-4" src="cid:logowitha" alt="" width="320" height="100">
    `;
    } else {
        emailBody = `
        <p style="font-size: 26px;">เรียน คุณ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.dispName},</p>
        <p style="font-size: 26px;">เลขที่พัสดุ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docID}</p>
        <p style="font-size: 26px;">สถานะการนำส่ง &nbsp; <span style="color: green;">สำเร็จ</span> </p>
        
        <p style="font-size: 26px;">รายละเอียด</p>
        <ul style="font-size: 25px;">
            <li>ชื่อลูกค้า/ผู้ติดต่อ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusName}</li>
            <li>รายละเอียดเอกสาร &nbsp;&nbsp; ${mailT.docType}${mailT.docIs}</li>
            <li>วันที่สั่งงาน &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.createdDateTime.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>วันที่นัด   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.requestDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}</li>
            <li>เวลาที่นัด    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docRound} ${mailT.docTime.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</li>
            <li>ประเภท (รับ/ส่ง) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.docSendReturn}</li>
            <li>สถานที่   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusPlace}</li>
            <li>หมายเลขโทรศัพท์ &nbsp;&nbsp;&nbsp;&nbsp; ${mailT.cusTel}</li>
            <li>นำส่งโดย    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${mailT.userNameSend}</li>
        </ul>
        <p style="font-size: 26px;">จึงเรียนมาเพื่อทราบ</p>
        <img class="d-block mx-auto mb-4" src="cid:logowitha" alt="" width="320" height="100">
    `;
    }
    sendmail({
      from: 'gehan.dube@bumail.net',
      to: mailSend,
      subject: 'จากระบบ Booking Messenger Web App',
      html: emailBody
    }, function (err, reply) {
        if(err){
            console.log("Error Alert")
        }
        console.log("Email Sent")
    })
}