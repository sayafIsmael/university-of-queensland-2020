const fs = require('fs');
const puppeteer = require('puppeteer');
const jsonCourseData = require('./data.json') || [];
const courseModel = require('./courseModel');

const scrapurl = 'https://my.uq.edu.au/programs-courses/search.html?searchType=course&keywords=&CourseParameters%5Bsemester%5D=2020:3';

// module.exports.fetchCourseDetails = async (scrapurl, sArea) => {
(async () => {

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });

        let courseRows = await page.$$('ul[class="listing"] > li').catch(e => console.log('Error: ', e.message))

        for (courseRow of courseRows) {
            let courseCode = await courseRow.$eval('h2 > a[class="code"]', a => a.textContent)
            let courseName = await courseRow.$eval('h2 > a[class="title"]', a => a.textContent)
            let courseDetails = await courseRow.$$('div[class="toggle-container"] > div[class="block"] > table > tbody > tr')
            let courseLevel = await courseDetails[0].$eval('td > span[class="course-level"]', span => span.textContent)
            let courseUnit = await courseDetails[0].$eval('td > span[class="course-units"]', span => span.textContent)
            let unitType = `Common Units (${courseUnit})`
            let semester = []
            console.log(unitType)
            let i
            for (i = 0; i < courseDetails.length; i++) {
                text += cars[i] + "<br>";
            }
        }

        // let courseName = programName.trim();
        // let courseCode = programCode.trim() || "NA";
        // let cricosCode = programCricosCode.trim() || "NA";
        // let courseLevel = programLevel.trim() || "NA";
        // let courseStudyModes = [];
        // let courseLink = scrapurl;
        // let semester = []
        // let unitType = `Common Units (${programUnits})` || "NA"
        // let description = programDescription ? programDescription.trim() : "NA"
        // let prerequisites = programPrerequisites ? programPrerequisites.trim() : "NA"
        // let studyArea = sArea.trim() || "NA"
        // let unitList = []

        let year = '2020'



        // let courseFinal = new courseModel (courseName, courseCode, courseLevel, cricosCode,
        // courseStudyModes, courseLink, prerequisites, semester, year,
        // unitType, unitList, description, studyArea)

        // if (!jsonCourseData.includes(courseFinal)) {
        //     jsonCourseData.push(courseFinal)
        //     fs.writeFile('data.json', JSON.stringify(jsonCourseData), (err) => {
        //         if (err) {
        //             console.log(err);
        //         }
        //         console.log("JSON data is saved. ", courseFinal);
        //     });
        //     await browser.close();
        //     return true
        // }
        await browser.close();
        return false

    } catch (error) {
        console.log(error)
    }

})();

// }