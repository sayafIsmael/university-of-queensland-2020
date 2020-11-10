const fs = require('fs');
const puppeteer = require('puppeteer');
const jsonCourseData = require('./data.json') || [];
const courseModel = require('./courseModel');

const scrapurl = 'https://my.uq.edu.au/programs-courses/program.html?acad_prog=2341';

module.exports.fetchCourseDetails = async (scrapurl, sArea) => {
// (async () => {

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });

        let courseSmstrs = await page.$eval('p[id="program-domestic-commencement"]', p => p.innerHTML).catch(e => console.log('Error: ', e.message)) || "NA"
        courseSmstrs = courseSmstrs.split('<br>')
        // console.log(courseSmstrs.split('<br>'))

        let programLevel = await page.$eval('p[id="program-domestic-awardlevel"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"


        let programCode = await page.$eval('p[id="program-domestic-programcode"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programName = await page.$eval('span[id="program-title"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programUnits = await page.$eval('p[id="program-domestic-units"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programDuration = await page.$eval('p[id="program-international-duration"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programCricosCode = await page.$eval('p[id="program-international-cricos"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"
        programCricosCode = programCricosCode ? programCricosCode.replace("CRICOS Code:", "") : "NA"

        let programPrerequisites = await page.$eval('p[id="program-international-entryreq"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programDescription = await page.$eval('div[class="usercontent"]', div => div.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programLocation = await page.$eval('p[id="program-international-location"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programDeliveryMode = await page.$eval('p[id="program-international-deliverymode"]', p => p.textContent).catch(e => console.log('Error: ', e.message)) || "NA"

        let programSubjects = await page.$$eval('ul[class="program-majors"] > li > a', majors => majors.map(a => a.textContent)).catch(e => console.log('Error: ', e.message)) || "NA"

        let courseName = programName.trim();
        let courseCode = programCode.trim() || "NA";
        let cricosCode = programCricosCode.trim() || "NA";
        let courseLevel = programLevel.trim() || "NA";
        let courseStudyModes = [];
        let courseLink = scrapurl;
        let semester = []
        let unitType = `Common Units (${programUnits})` || "NA"
        let description = programDescription ? programDescription.trim() : "NA"
        let prerequisites = programPrerequisites ? programPrerequisites.trim() : "NA"
        let studyArea = sArea.trim() || "NA"
        let unitList = []

        let year = '2020'
      
        courseSmstrs && courseSmstrs.map(smstr => {
            let semesteName = smstr.trim()
            let regExp = /\(([^)]+)\)/;
            let matches = regExp.exec(semesteName);
            semesteName = semesteName.replace(`(${matches[1]})`, '')
            semesteName = semesteName.trim()
            semester.push(
                {
                    year: `${matches[1].includes('2020') ? '2020' : 'NA'}`,
                    semester: semesteName,
                    attendanceMode: programDeliveryMode.trim(),
                    location: programLocation.trim(),
                    learningMethod: "NA"
                }
            )
        })

        programSubjects && programSubjects.map(subject => {
            unitList.push({
                code: "NA",
                title: subject,
                year,
                hours: null,
                creditPoints: "NA",
                semester,
                sector: courseLevel,
                discipline: "NA",
                prerequisites,
                incompatible: "NA",
                assumedKnowledge: "NA",
                description
            })
        })

        // console.log(semester)

        if (programDuration && programDuration.includes('full-time')) {
            programDuration = programDuration.replace('full-time', '')
            courseStudyModes.push(
                {
                    studyMode: "Full-time",
                    duration: programDuration.trim()
                }
            )
        } else if (programDuration && programDuration.includes('part-time')) {
            programDuration = programDuration.replace('part-time', '')
            courseStudyModes.push(
                {
                    studyMode: "Part-time",
                    duration: programDuration.trim()
                }
            )
        }


        let courseFinal = new courseModel (courseName, courseCode, courseLevel, cricosCode,
        courseStudyModes, courseLink, prerequisites, semester, year,
        unitType, unitList, description, studyArea)

        if (!jsonCourseData.includes(courseFinal)) {
            jsonCourseData.push(courseFinal)
            fs.writeFile('data.json', JSON.stringify(jsonCourseData), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log("JSON data is saved. ", courseFinal);
            });
            await browser.close();
            return true
        }
        await browser.close();
        return false

    } catch (error) {
        console.log(error)
    }

// })();

}