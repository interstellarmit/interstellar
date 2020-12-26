const axios = require("axios");
const User = require("./models/user");
const Page = require("./models/page");
const Semester = require("./models/semester");

let updateSemesters = async () => {
  let data = await axios.get("https://fireroad.mit.edu/courseupdater/semesters/");
  let sems = data.data;
  // Put new semesters in
  console.log(sems);
  let newSemesters = [];
  await Promise.all(
    sems.map(async (sem) => {
      let existingSem = await Semester.findOne({ identifier: sem.sem });
      if (!existingSem) {
        let newSem = new Semester({
          identifier: sem.sem,
          name: sem.sem.split("-")[0].toUpperCase() + " " + sem.sem.split("-")[1],
          versionNumber: sem.v,
        });
        await newSem.save();
        newSemesters.push(sem.sem);
      }
    })
  );

  for (var i = 0; i < newSemesters.length; i++) {
    let newSemester = newSemesters[i];
  }
};

let addCourse = async (course) => {
  let existingPage = await Page.findOne({ name: course.subject_id });
  if (existingPage) {
    // update course
    //existingPage.pageType = "Class";
    //await existingPage.save();
  } else {
    let newCourse = new Page(
      Object.assign(course, {
        name: course.subject_id,
        pageType: "Class",
        professor: course.instructors[0] || "",
      })
    );
    //console.log(newCourse);
    await newCourse.save();
  }
};

let clearClasses = async () => {
  let keepIds = [];
  let pages = await Page.find({}).select("_id name pageType");
  await Promise.all(
    pages
      .filter((pg) => {
        return pg.pageType && pg.pageType !== "Class";
      })
      .map(async (pg) => {
        keepIds.push(pg._id + "");
      })
  );
  let users = await User.find({});
  await Promise.all(
    users.map(async (user) => {
      user.pageIds = user.pageIds.filter((id) => {
        return keepIds.includes(id);
      });
      await user.save();
    })
  );
  await Page.remove({ pageType: "Class" });
};

initialise = async () => {
  console.log("Starting initialization");
  await updateSemesters();
  console.log("Updated Semesters");
  await clearClasses();
  console.log("Cleared Classes");
  let data = await axios.get("https://fireroad.mit.edu/courses/all?full=true");
  let courses = data.data;
  for (var i = 0; i < courses.length; i++) {
    await addCourse(courses[i]);
    //await new Promise((resolve) => setTimeout(resolve, 100));
    if (i % 100 == 0) console.log(i);
  }
  console.log("Done");
};

module.exports = {
  initialise,
};
