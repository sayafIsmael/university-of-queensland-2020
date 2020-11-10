const fs = require('fs');
const puppeteer = require('puppeteer');
const jsonCourseData = require('./data.json') || [];
const courseModel = require('./courseModel');

const scrapurl = 'https://my.uq.edu.au/programs-courses/program.html?acad_prog=2341';

// module.exports.fetchCourseDetails = async (scrapurl, studyArea) => {
(async () => {

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });

        let courseSmstrs = await page.$eval('p[id="program-domestic-commencement"]', p => p.innerHTML)
        courseSmstrs = courseSmstrs.split('<br>')
        // console.log(courseSmstrs.split('<br>'))

        let programLevel = await page.$eval('p[id="program-domestic-awardlevel"]', p => p.textContent)

        let programCode = await page.$eval('p[id="program-domestic-programcode"]', p => p.textContent)

        let programName = await page.$eval('span[id="program-title"]', p => p.textContent)

        let programUnits = await page.$eval('p[id="program-domestic-units"]', p => p.textContent)

        let programDuration = await page.$eval('p[id="program-international-duration"]', p => p.textContent)

        let programCricosCode =  await page.$eval('p[id="program-international-cricos"]', p => p.textContent)
        programCricosCode = programCricosCode ? programCricosCode.replace("CRICOS Code:","") : "NA"

        let programPrerequisites = await page.$eval('p[id="program-international-entryreq"]', p => p.textContent)
        
        let programDescription = await page.$eval('div[class="usercontent"]', div => div.textContent)
        
        let programLocation = await page.$eval('p[id="program-international-location"]', p => p.textContent)

        let programDeliveryMode = await page.$eval('p[id="program-international-deliverymode"]', p => p.textContent)


        console.log(programLocation, programDeliveryMode)

        let courseName = "NA";
        let courseCode = "NA";
        let cricosCode = "NA";
        let courseLevel = "NA";
        let courseStudyModes = [];
        let courseLink = scrapurl;
        let semester = []
        let unitType = "NA"
        let description = "NA"
        let campuses = []
        // let studyArea = studyArea

        


        // let basicItems = await page.$$eval('div[class="fast-fact-item"] > strong', strongItms => strongItms.map(strong => strong.textContent)).catch(e => console.log('Error: ', e.message))
        // let basicItemsData = await page.$$eval('div[class="fast-fact-item"] > p', paragItms => paragItms.map(p => p.textContent)).catch(e => console.log('Error: ', e.message))

        // basicItems.map((item, i) => {
        //     switch (item) {
        //         case "Course code":
        //             courseCode = basicItemsData[i]
        //             break;
        //         case "Units":
        //             unitType = `Common Units (${basicItemsData[i]})`
        //             break;
        //         case "Level":
        //             courseLevel = basicItemsData[i]
        //             break;
        //         // case y:
        //         //     // code block
        //         //     break;
        //         default:
        //         // code block
        //     }
        // })

        // let [cDescription] = await page.$x('//*[@id="course-details"]/p[1]')
        // description = await cDescription.getProperty('textContent')
        // description = await description.jsonValue()


        // let semestersData = await page.$$('div[class="grid-content grid-3-column"] > div[class="grid-block"]').catch(e => console.log('Error semester data: ', e.message))

        // if (semestersData.length) {
        //     for (sdata of semestersData){
        //         let location = await sdata.$eval('h4', h4 => h4.textContent).catch(e => console.log('Error location: ', e.message))
        //         let semesters = await sdata.$$eval('ul > li', data => data.map(li => li.textContent)).catch(e => console.log('Error semester: ', e.message))

        //         semesters.map(async (smster) => {
        //             let smsterTxt = smster
        //             let semestrYear = "NA"
        //             if (smster.includes('-')) {
        //                 let smsterData = smster.split('-')
        //                 semestrYear = smsterData[1]
        //                 smsterTxt = smsterData[0]
        //             }
        //             semester.push(
        //                 {
        //                     year: semestrYear,
        //                     semester: smsterTxt,
        //                     attendanceMode: "Internal",
        //                     location,
        //                     learningMethod: "NA"
        //                 }
        //             )
        //         })
        //         campuses.push({
        //             type: "Offline",
        //             campusName: location,
        //             postalAddress: null,
        //             state: null,
        //             geolocation: {
        //                 lat: null,
        //                 lan: null
        //             }
        //         })
        //     }
        // }
        // // console.log(semester)

        // let courseFinal = new courseModel(courseName, courseCode, courseLevel,
        // courseStudyModes, totalCreditPoints = "NA", courseLink, isAvailableOnline = {},
        // prerequisites = "NA", semester, year, unitType,  description, campuses)

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