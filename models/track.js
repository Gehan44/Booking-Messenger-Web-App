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

module.exports = async function createTrack(trackData,hostname) {
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
        const docQR = `https://${hostname}/mHome?updatedEditTerm=${docID}`;
        const docQRCode = qr.imageSync(docQR, { type: 'png', size: 4 });

        //CreatedDate
        createdDateTime = moment().format('YYYY-MM-DD HH:mm')

        //DocTime
        //if (trackData.docTime === "") {
        //    trackData.docTime = null
        //}

        //DocFnote
        trackData.docFnote = ""
        
        // Insert the new track
        const result = await request.query(`
            INSERT INTO tracks (
                docID, docQR, userIDCreated, status, createdDateTime, requestDate,
                docRound, docTime, docSendReturn, docType, docIs, docFnote,
                cusName, cusPlace, cusTel, dispName, dispTel, dispEmail, dispNote
            )
            VALUES (
                '${docID}', '${docQR}', ${trackData.userIDCreated},
                '${"Created"}', '${createdDateTime}',
                '${trackData.requestDate}', '${trackData.docRound}',
                 ${trackData.docTime ? `'${trackData.docTime}'` : 'NULL'}, 
                '${trackData.docSendReturn}',
                '${trackData.docType}', '${trackData.docIs}', '${trackData.docFnote}',
                '${trackData.cusName}', '${trackData.cusPlace}', '${trackData.cusTel}',
                '${trackData.dispName}', '${trackData.dispTel}', '${trackData.dispEmail}',
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
        console.error('Error creating track:', error);
    }
}