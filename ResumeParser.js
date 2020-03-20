const moment = require("moment");

class ResumeParser {
	constructor() {
		this.fName = "";
		this.lName = "";
	}
  getName(line) {
    const trimmedLine = line.replace(" +", " ");
    const lineContent = trimmedLine.replace("^\\s+", "");
    const lineArr = lineContent.split(" ");
    if (lineArr.length && lineArr.length === 1) {
			if (this.fName) {
				this.lName = lineArr[0];
			} else {
				this.fName = lineArr[0];
			}
    } else if (lineArr.length && lineArr.length <= 3) {
      this.fName = lineArr[0];
      this.lName = lineArr[1];
      if (lineArr.length == 3) {
        this.lName = (lineArr[1] + " " + lineArr[2]).trim();
      }
		}
  }
  parse(resumeData) {
    let fileContent = resumeData;
    let lines = [];
    fileContent.toString().replace("^\\s+", "");

    const emailRegex = new RegExp(
      "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+"
    );
    const email = emailRegex.exec(fileContent)
      ? emailRegex.exec(fileContent)[0]
      : "";

    const mobileRegex = new RegExp("\\d{10}"); //unable to find +91890.. or 0890.. type numbers
    const mobile = mobileRegex.exec(fileContent)
      ? mobileRegex.exec(fileContent)[0]
      : "";

    const phoneRegex = new RegExp("\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}");
    const phone = phoneRegex.exec(fileContent)
      ? phoneRegex.exec(fileContent)[0]
      : ""; //none found

    // lines = fileContent.split("[\\r\\n]+");// giving only 1 line resume
    const lineSplitRegex = /\r\n|\n\r|\n|\r/g;
    lines = fileContent.replace(lineSplitRegex, "\n").split("\n");
    lines = lines.map(line => {
      line = line.trim();
      return line;
    });
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]) {
				this.getName(lines[i]);
				if (this.fName && this.lName) {
					break;
				}
      }
    }
  
    //-------------------------------------------------------------------------------------
    //Get all sentences which contain the word years/year
    let str = "";
    let totExp = 0;
    // let sentences = fileContent.split("\\.\\s+"); //forms a single element of array, no experience written in AV resume
    for (let sentence of lines) {
      if (
        sentence.toLowerCase().includes("year") ||
        sentence.toLowerCase().includes("month")
      ) {
        str += sentence;
        // break; // to terminate when one digit related to years/year found, condition for months/month newly added else it will calculate all the year/months as years of experience
      }
    }
    console.log("STRRR:::", str)

    //get years of experience from a string which may include experience in years and months
    //Eg: 1 year 2 months
    //Eg: 11 months
    //Eg:  1.5 years
    let getYearsOfExpRegex = /\d+(\.\d+)?\s?(years|year|months|month)/gim;
    let m;
    let experienceStr = [];

    //Loops over multiple sentences where years of experience are found in the above formats
    while ((m = getYearsOfExpRegex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      //test why is this reqd
      if (m.index === getYearsOfExpRegex.lastIndex) {
        getYearsOfExpRegex.lastIndex++;
      }
      experienceStr.push(m[0]);
    }
    console.log("experienceStr:::", experienceStr)

    let monthsOfExp = 0;
    for (let exp of experienceStr) {
      if (exp.toLowerCase().includes("year")) {
        let yearsOfExp = parseFloat(
          exp
            .toLowerCase()
            .split("year")[0]
            .trim()
        );
        monthsOfExp += moment.duration(yearsOfExp, "years").asMonths();
      } else if (exp.toLowerCase().includes("month")) {
        monthsOfExp += parseFloat(
          exp
            .toLowerCase()
            .split("month")[0]
            .trim()
        );
      }
    }

    if (monthsOfExp) {
      totExp = parseFloat(
        moment
          .duration(monthsOfExp, "months")
          .asYears()
          .toFixed(1)
      );
    }

    if (!totExp) {
      //Format for dd/mm/yyyy or dd-mm-yyyy or dd/mm/yyyy or dd-mm-yyyy
      const ddmmyyyyRegex = /\d{1,2}[-\/]\d{1,2}[-\/]\d{4}/g;
      //Format for mm/yyyy or mm-yyyy format or mm-yyyy or mm/yyyy
      const mmyyyyRegex = /\s(\d{2}[-\/](\d{4}))/g;
      //Format for eg: April,2019,June2018,Apr 2019,27 December 2017,26th June 2018
      const monthInWordsRegex = /(\d{1,2})?(st|nd|rd|th)?(\s)?(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\s?,?)\d{4}/g;
      let experience = [];

      while ((m = ddmmyyyyRegex.exec(fileContent)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === ddmmyyyyRegex.lastIndex) {
          ddmmyyyyRegex.lastIndex++;
        }
        experience.push(moment(m[0], "DD-MM-YYYY"));
      }
      console.log("experience??", experience)
      while ((m = mmyyyyRegex.exec(fileContent)) !== null) {
        m[0].trim();
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === mmyyyyRegex.lastIndex) {
          ddmmyyyyRegex.lastIndex++;
        }
        experience.push(moment(m[0], "MM-YYYY"));
      }
      console.log("experience??", experience)

      //handle this using moment
      while ((m = monthInWordsRegex.exec(fileContent)) !== null) {
        let date;
        let year = 0;
        let month = "";
        let day = 0;
        m[0].trim();
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === monthInWordsRegex.lastIndex) {
          ddmmyyyyRegex.lastIndex++;
        }
        // console.log(m[0], m[0].split(" ").length);

        const len = m[0].split(" ").length;
        if (len === 3) {
          date = m[0].split(" ");
          day = parseInt(date[0]) ? parseInt(date[0]) : 1;
          month = date[1];
          month = month.match(/\w+/) ? month.match(/\w+/)[0] : 0;
          year = parseInt(date[2]);
        }
        if (len === 2) {
          // console.log("date?", m[0]);
          date = m[0].split(" ");
          month = date[0];
          day = month.match(/\d*/) ? +month.match(/\d*/)[0] : 0;
          month = month.match(/\[a-z]+/) ? month.match(/\[a-z]+/)[0] : "";
          year = parseInt(date[1]);
          // console.log(day, month, year);
        }
      }

      if (experience) {
        let experienceInDays = 0;
        if (experience.length % 2 !== 0) {
          experience.push(moment());
        }
        experience.sort(function(a, b) {
          return moment(b).format("X") - moment(a).format("X");
        });
        for (let i = 0; i < experience.length; i = i + 2) {
          experienceInDays += experience[i].diff(experience[i + 1], "days");
        }
        totExp = parseFloat(
          moment
            .duration(experienceInDays, "days")
            .asYears()
            .toFixed(2)
        );
      }
      // if (ddmmyyyyRegex.exec(fileContent)) {
      //     do {
      //         exp = ddmmyyyyRegex.exec(fileContent);
      //         if (exp) {
      //             let expDate;
      //             if (exp[0].includes("-")) {
      //                 expDate = exp[0].split("-");
      //             }
      //             if (exp[0].includes("/")) {
      //                 expDate = exp[0].split("/");
      //             }
      //             const expInDate = new Date(expDate[2], expDate[1] - 1, expDate[0]);
      //             experience.push(expInDate);
      //         }
      //     } while(exp);

      //     if (experience.length) {
      //         const min = experience.reduce((a, b) => { return a < b ? a : b; });
      //         // const max = experience.reduce((a, b) => { return a > b ? a : b; });
      //         const max = new Date();

      //         const diffTime = max.getTime() - min.getTime();
      //         totExp = parseFloat((diffTime / (1000 * 60 *60 * 24 * 365)).toFixed(1));
      //     }
      // }
      // if (mmyyyyRegex.exec(fileContent)) {
      //     do {
      //         exp = mmyyyyRegex.exec(fileContent);
      //         console.log(exp[0])
      //         if (exp) {
      //             let expDate;
      //             if (exp[0].includes("-")) {
      //                 expDate = exp[0].split("-");
      //             }
      //             if (exp[0].includes("/")) {
      //                 expDate = exp[0].split("/");
      //             }
      //             const expInDate = new Date(expDate[1], expDate[0]);
      //             experience.push(expInDate);
      //         }
      //     } while(exp);

      //     if (experience.length) {
      //         const min = experience.reduce((a, b) => { return a < b ? a : b; });
      //         // const max = experience.reduce((a, b) => { return a > b ? a : b; });
      //         const max = new Date();

      //         const diffTime = max.getTime() - min.getTime();
      //         totExp = parseFloat((diffTime / (1000 * 60 *60 * 24 * 365)).toFixed(1));

      //     }
      // }
    }

    let skills = ""; //considers entire resume as skills, since there is only 1 sentence
    for (let sentence of lines) {
      if (
        sentence.toLowerCase().includes("languages") ||
        sentence.toLowerCase().includes("technical skills") ||
        sentence.toLowerCase().includes("language") ||
        sentence.toLowerCase().includes("Programming languages")
      ) {
        skills = sentence;
        break;
      }
    }

    let resumeJSON = {
      fName: this.fName,
      lName: this.lName,
      email,
      mobile,
      phone,
      totExp,
      skills
    };

    console.log("parsed resume???", resumeJSON);
  }
}

module.exports = ResumeParser;

//((\+91\s|\+91|\+91-|91-|91\s|0\s|0-))?(\d{10}$) regex for mobile nos, not final

// +91 8446584708
// +918446584708
// +91-8446584708
// 91-8446584708
// 91 8446584708
// 918446584708
// 8446584708
// 08446584708
// 0 8446584708
// 0-8446584708

// \d\d[-\/]\d\d[-\/]\d\d\d\d
// \d+[-\/]\d+[-\/]\d+