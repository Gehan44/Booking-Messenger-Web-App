const sql = require('mssql');
const config = require('../sqlConfig');
const runDetect = require('./emailFunction');
const scheduledJobs = {};

function taskStart(createdTrack) {
    const ID = createdTrack.docID;
    let date = createdTrack.requestDate;
    date.setUTCHours(18);
    date.setUTCMinutes(30);
    const targetDate = date;

    const createdDateTime = createdTrack.createdDateTime

    console.log(createdDateTime);
    console.log(targetDate);
    
    const delay = targetDate.getTime() - createdDateTime.getTime();
    console.log(delay);
    
    const sum = new Date(createdDateTime.getTime() + delay);
    console.log(sum);    
    

    if (delay > 0) {
        scheduledJobs[ID] = setTimeout(async () => {
            console.log(`Task executed at specific time for docID ${ID}`);
            try {
                await sql.connect(config);
                const request = new sql.Request();
                await request.query(`UPDATE tracks 
                    SET userNameSend = 
                    CASE WHEN userNameSend IS NULL THEN '' ELSE userNameSend END,
                    status = 'Failed',docFnote = 'ส่งไม่ทันตามวันที่นัด' WHERE docID = '${ID}'`);
                const createdTrack = await request.query(`SELECT * FROM tracks WHERE docID = '${ID}'`);
                mail = null;
                await runDetect(createdTrack.recordset[0], mail);
            } catch (error) {
                console.error("Error occurred while executing the task:", error);
            }
        }, delay);

        scheduledJobs[ID].targetDate = targetDate;
        sortJobs();
    } else {
        console.error("Target date is in the past.");
    }
}

function sortJobs() {
    const sortedJobs = Object.entries(scheduledJobs).sort((a, b) => {
        return a[1].targetDate - b[1].targetDate;
    });
    return sortedJobs.map(job => job[0]);
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

module.exports = { taskStart, taskStop, sortJobs };