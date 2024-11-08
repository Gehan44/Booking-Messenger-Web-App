const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');
const scheduledJobs = {};

function taskStart(createdTrack) {
    const ID = createdTrack.docID;
    let date = createdTrack.requestDate;
    date.setUTCHours(19);
    //date.setUTCMinutes();
    const targetDate = date;
    const createdDateTime = createdTrack.createdDateTime 
    const delay = targetDate.getTime() - createdDateTime.getTime();

    if (delay > 0) {
        scheduledJobs[ID] = setTimeout(async () => {
            //console.log(`Task executed at specific time for docID ${ID}`);
            try {
                await sql.connect(config);
                const request = new sql.Request();
                await request.query(`UPDATE tracks 
                    SET userNameSend = 
                    CASE WHEN userNameSend IS NULL THEN '' ELSE userNameSend END,
                    status = 'Failed',docNote = 'พัสดุส่งไม่ทันตามวันที่นัด' WHERE docID = '${ID}'`);
                const createdTrack = await request.query(`SELECT * FROM tracks WHERE docID = '${ID}'`);
                await runDetect(createdTrack.recordset[0]);
                taskStop(ID)
            } catch (error) {
                console.error("Error occurred while executing the task:", error);
            }
        }, delay);
    } else {
        console.error("Target date is in the past.");
    }
}

function taskStop(ID) {
    const timeoutId = scheduledJobs[ID];
    if (timeoutId) {
        clearTimeout(timeoutId);
        delete scheduledJobs[ID];
        //console.log(`Scheduled job with ID ${ID} stopped.`);
    } else {
        console.error(`No scheduled job found with ID ${ID}.`);
    }
}

module.exports = { taskStart, taskStop, scheduledJobs };