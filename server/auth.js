require("dotenv").config();
const User = require("./models/user");
const Page = require("./models/page");
const socket = require("./server-socket");

const { check, validationResult } = require("express-validator/check");

const axios = require("axios");

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}


const fetchUserInfo = async (code) => {
  const password = "DH3ordzkbjBra9";
  try {
    let data = await axios({
      url: process.env.FIREROAD_LINK + `fetch_token/?code=${code}`
    })
    data = data.data
    const accessToken = data.access_info.access_token;
    const email = data.access_info.academic_id;

    let userData = await axios({
      url: process.env.FIREROAD_LINK + "user_info",
      headers: { 'Authorization': "Bearer " + accessToken },
    })
    userData = userData.data;
    const name = userData.name;
    return { name, email, password, accessToken }
  } catch (e) {
    console.log(e)
  }
  return {}
}

const signUpLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { code } = req.query;
  const { name, email, password, accessToken } = await fetchUserInfo(code)
  console.log(name, email, password, accessToken)
  try {
    let user = await User.findOne({
      email: email,
    });
    if (user) {
      user.accessToken = accessToken;
      user.save().then((user) => {
        req.session.user = user;
        return res.redirect("/");
      })
    }
    else {
      //let schoolEmail = encodeURI(email.split("@")[1].replace(/ /g, "_"));
      // let school = await School.findOne({ email: schoolEmail });
      user = new User({
        name: name,
        email: email,
        accessToken: accessToken,
        //schoolId: school ? school._id : "None",
        isVerified: true,
      })
      console.log(user);
      await user.save(function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send({ msg: err.message });
        }
      });

      req.session.user = user;
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in Saving" });
  }
}

async function signContract(req, res) {
  let semesterTypes = ['fall', 'iap', 'spring']
  try {
    User.findById(req.user._id).then(async (user) => {
      user.signedContract = true;
      user.classYear = req.body.classYear;

      if (!req.body.importClasses) {
        return user.save().then((user) => {
          res.send({ user })
        })
      }
      console.log(req.body)
      let id = req.body.roadId || undefined;
      if (id) {
        let road = await axios({
          url: process.env.FIREROAD_LINK + `sync/roads/?id=${id}`,
          headers: { 'Authorization': "Bearer " + req.user.accessToken },
        })
        let contents = road.data.file.contents
        console.log(contents);
        await Promise.all(contents.selectedSubjects.map(async (subject) => {
          try {
            const page = await Page.findOne({ pageType: "Class", name: subject.id })
            if (!page) {
              console.log(subject)
              return;
            }
            let isUserPage = user.pageIds.find((element) => {
              return element.pageId == page._id
            })
            if (!isUserPage) {
              const semesterType = semesterTypes[(subject.semester + 2) % 3]
              const year = Number(req.body.classYear) - 4 + Math.floor((subject.semester + 1) / 3);
              const semester = subject.semester === 0 ? "prereq" : `${semesterType}-${year}`
              user.pageIds.push({
                pageId: page._id + "",
                semester: semester,
              })
            }
            return page;
          } catch (err) {
            console.log(err.message)
            return;
          }
        }))
        console.log(user)
        user.markModified("pageIds")
        user.save().then((user) => {
          res.send({ user });
        })
      } else {
        user.save().then((user) => {
          res.send({ user });
        })
      }
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: "Error in signing contract" });
  }
}

module.exports = {
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  signUpLogin,
  signContract,
};
