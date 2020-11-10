const fs = require('fs');
// const uid = require('uid')
const jsonLinkData = require('./linkFetched.json') || [];

const puppeteer = require('puppeteer');
const scrapurl = 'https://my.uq.edu.au/programs-courses/browse.html?level=pgpg';
const scrapCourse = require('./scrapCourse');


async function start() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });

    const self = {

        parseResult: async () => {
            try {
                let courseRows = await page.$$('td[class="title"] > a');

                for (const courseRow of courseRows) {
                    let studyArea = await courseRow.getProperty('textContent')
                    studyArea = await studyArea.jsonValue()
                    let courseLink = await courseRow.getProperty('href').catch(e => console.log('Error: ', e.message))
                    courseLink = await courseLink.jsonValue()
                    console.log(courseLink)

                    if (courseLink && !jsonLinkData.includes(courseLink)) {

                        let courseSaved = await scrapCourse.fetchCourseDetails(courseLink, studyArea)
                        if (courseSaved) {
                            jsonLinkData.push(courseLink)
                            fs.writeFile('linkFetched.json', JSON.stringify(jsonLinkData), (err) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log("Course link is saved. ", courseLink);
                            });
                        }

                    }
                }

                await browser.close();
                return false

            } catch (error) {
                console.log(error);
            }
        },


    }

    let start = await self.parseResult();
    // self.parseResult()
}
start()