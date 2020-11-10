var UniqueNumber = require("unique-number");
var uniqueNumber = new UniqueNumber(true);

const model = function (courseName = "NA", courseCode = "NA", courseLevel = "NA", cricosCode="NA",
    courseStudyModes = [], courseLink = "NA", prerequisites = "NA", semester = [], year = "NA",
    unitType = "NA", unitList = [], description = "NA", studyArea) {
    this.courseId = "UQ-" + uniqueNumber.generate()
    this.courseName = courseName
    this.courseCode = courseCode
    this.cricosCode = cricosCode
    this.studyArea = studyArea
    this.courseLevel = courseLevel
    this.courseStudyModes = courseStudyModes
    this.totalCreditPoints = "NA"
    this.courseUnits = [
        {
            unitType,
            creditPoints: "NA",
            description,
            unitList
        },
    ]
    this.isAvailableOnline = {}
    this.campuses = []
    this.courseFees = []
    this.institutionSpecificData = {}
    this.courseLink = courseLink
}

module.exports = model;
