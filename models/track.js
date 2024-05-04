const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');

const sql = require('mssql');
const sqlConfig = require('../sqlConfig');
const qr = require('qr-image')

function padWithZeros(number) {
    return String(number).padStart(3, '0');
}

module.exports = async function createTrack(userData,trackData,hostname) {
    try {
        const year = moment().format('YY')
        const month = moment().format('MM')
        const day = moment().format('DD')

        //DocID
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        const lastTrackQuery = await request.query(`
            SELECT TOP 1 docID
            FROM tracks
            ORDER BY docID DESC
        `);
        if (!lastTrackQuery.recordset[0]) {
            docID = `P${year}${month}${day}001`;
        } else {
            const lastDocID = lastTrackQuery.recordset[0].docID;
            // Extract 'Pyear'
            let prefix = lastDocID.substring(0, 3);
            // Extract 'month'
            let midfix = lastDocID.substring(3, 5);
            // Extract 'day'
            let lastfix = lastDocID.substring(5, 7);
            // Extract '001'
            let suffix = lastDocID.substring(7);
            const lastCounter = parseInt(suffix);

            if (prefix === `P${year}`) {
                if (midfix === `${month}`) {
                    if (lastfix === `${day}`) {
                        const newCounter = lastCounter + 1;
                        docID = `P${year}${month}${day}${padWithZeros(newCounter)}`;
                    } else {
                        docID = `P${year}${month}${day}001`;
                    }
                } else {
                    docID = `P${year}${month}${day}001`;
                }
            } else {
                docID = `P${year}${month}${day}001`;
            }
        }

        //CreatedDate
        createdDateTime = moment().format('YYYY-MM-DD HH:mm')

        //disp
        let dispName = ""
        let dispEmail = ""
        if (userData.role === "Support") {
            dispName = trackData.dispName
            dispEmail = trackData.dispEmail

        } else if (userData.role === "User") {
            dispName = userData.name
            dispEmail = userData.email
        }
        
        //docNote
        trackData.docNote = ""

        //QRCode
        let docQR = ""
        let docQRCode = ""

        //messenger
        let messenger = trackData.messenger 
        let messengerID = ""

        if (messenger === "Outsource") {            
        } else {
            docQR = `https://${hostname}/mHome?updatedEditTerm=${docID}`;
            docQRCode = qr.imageSync(docQR, { type: 'png', size: 4 }); 
        }
        
        // Insert the new track
        const result = await request.query(`
            INSERT INTO tracks (
                docID, docQR, userIDCreated, status, createdDateTime, requestDate,
                docRound, docTime, docSendReturn, docType, docIs, docNote, userIDSend, userNameSend,
                cusName, cusPlace, cusTel, dispName, dispTel, dispEmail, dispNote
            )
            VALUES (
                '${docID}',
                ${docQR ? `'${docQR}'` : 'NULL'}, 
                '${userData.userID}',
                '${"Created"}', '${createdDateTime}',
                '${trackData.requestDate}', '${trackData.docRound}',
                ${trackData.docTime ? `'${trackData.docTime}'` : 'NULL'}, 
                '${trackData.docSendReturn}',
                '${trackData.docType}', '${trackData.docIs}', '${trackData.docNote}',
                ${messengerID ? `'${messengerID}'` : 'NULL'}, 
                ${messenger ? `'${messenger}'` : 'NULL'}, 
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
        console.error(error)
        return res.redirect('/')
    }
}