const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');
const scheduledJobs = {};

function taskStart(createdTrack,date) {
    ID = createdTrack.docID

    date.setUTCHours(17);
    //date.setUTCMinutes();
    date = date.toISOString().replace('Z', '');

    const targetDate = new Date(date);
    const currentDate = new Date();
    const delay = targetDate.getTime() - currentDate.getTime();

    if (delay > 0) {
        scheduledJobs[ID] = setTimeout(async () => {
            //console.log(`Task executed at specific time for docID ${ID}`);
            try {
                await sql.connect(config);
                const request = new sql.Request();
                await request.query(`UPDATE tracks SET status = 'Failed', docFnote = 'ไม่ถูกนำส่งตามเวลาที่กำหนด' WHERE docID = '${ID}'`);
                mail = null
                await runDetect(createdTrack, mail);
            } catch (error) {
                //console.error("Error occurred while executing the task:", error);
            }
        }, delay);
    } else {
        //console.error("Target date is in the past.");
    }
    
}

function taskStop(ID) {
    const timeoutId = scheduledJobs[ID];
    if (timeoutId) {
        clearTimeout(timeoutId);
        delete scheduledJobs[ID];
        //console.log(`Scheduled job with ID ${ID} stopped.`);
    } else {
        //console.error(`No scheduled job found with ID ${ID}.`);
    }
}

module.exports = { taskStart,taskStop };