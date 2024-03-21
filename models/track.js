const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');

const sql = require('mssql');
const sqlConfig = require('../sqlConfig');
const qr = require('qr-image')

function padWithZeros(number) {
    return String(number).padStart(3, '0');
}

function padWithZeroM(number) {
    return String(number).padStart(2, '0');
}

module.exports = async function createTrack(userData,trackData,protocol,hostname) {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2);
        const umonth = currentDate.getMonth() + 1;
        const month = padWithZeroM(umonth);

        //DocID
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        const lastTrackQuery = await request.query(`
            SELECT TOP 1 docID
            FROM tracks
            ORDER BY docID DESC
        `);
        if (!lastTrackQuery.recordset[0]) {
            docID = `P${year}${month}001`;
        } else {
            const lastDocID = lastTrackQuery.recordset[0].docID;
            // Extract 'P24'
            let prefix = lastDocID.substring(0, 3);
            // Extract '03'
            let midfix = lastDocID.substring(3, 5);
            // Extract '001'
            let suffix = lastDocID.substring(5);
            const lastCounter = parseInt(suffix);
            if (prefix === `P${year}`) {
                if (midfix === `${month}`) {
                    const newCounter = lastCounter + 1;
                    docID = `P${year}${month}${padWithZeros(newCounter)}`;
                } else {
                    docID = `P${year}${month}001`;
                }
            } else {
                docID = `P${year}${month}001`;
            }
        }

        //QRCode
        const docQR = `${protocol}://${hostname}/mHome?updatedEditTerm=${docID}`;
        const docQRCode = qr.imageSync(docQR, { type: 'png', size: 4 });

        //CreatedDate
        createdDateTime = moment().format('YYYY-MM-DD HH:mm')

        //disp
        let createdID = ""
        let dispName = ""
        let dispEmail = ""

        if (userData.role === "Wealth Support") {
            dispName = trackData.dispName
            dispEmail = trackData.dispEmail
            const dispResult = await request.query(`
            SELECT *
            FROM dbo.users
            WHERE email = '${dispEmail}'`);
            disp = dispResult.recordset[0]
            if (disp && disp.role === "Sale") {
                createdID = disp.userID
            } else {
                createdID = userData.userID
            }
        } else if (userData.role === "Sale") {
            createdID = userData.userID
            dispName = userData.name

            const dispResult = await request.query(`
            SELECT *
            FROM dbo.users
            WHERE userID = '${createdID}'`);
            disp = dispResult.recordset[0]
            dispEmail = disp.email
        }

        //docFnote
        trackData.docFnote = ""
        
        // Insert the new track
        const result = await request.query(`
            INSERT INTO tracks (
                docID, docQR, userIDCreated, status, createdDateTime, requestDate,
                docRound, docTime, docSendReturn, docType, docIs, docFnote,
                cusName, cusPlace, cusTel, dispName, dispTel, dispEmail, dispNote
            )
            VALUES (
                '${docID}', '${docQR}', ${createdID},
                '${"Created"}', '${createdDateTime}',
                '${trackData.requestDate}', '${trackData.docRound}',
                 ${trackData.docTime ? `'${trackData.docTime}'` : 'NULL'}, 
                '${trackData.docSendReturn}',
                '${trackData.docType}', '${trackData.docIs}', '${trackData.docFnote}',
                '${trackData.cusName}', '${trackData.cusPlace}', '${trackData.cusTel}',
                '${dispName}', '${trackData.dispTel}', '${dispEmail}',
                '${trackData.dispNote}'
            )
        `);

        // Retrieve the created track data
        const createdTrack = await request.query(`
                SELECT *
                FROM tracks
                WHERE docID = '${docID}'
            `);

        // Return the created track data
        return { createdTrack: createdTrack.recordset[0], docQRCode };

    } catch (error) {
        return res.redirect('/')
    }
}