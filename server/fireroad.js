const User = require("./models/user");
const Page = require("./models/page");

const axios = require("axios");

async function sync(req, res) {
  try {
    let roadData = await axios({
      url: process.env.FIREROAD_LINK + "sync/roads",
      headers: { Authorization: "Bearer " + req.user.accessToken },
    });
    roadData = roadData.data.files;
    let id = Object.keys(roadData)[0] || undefined;
    if (id) {
      let road = await axios({
        url: process.env.FIREROAD_LINK + `sync/roads/?id=${id}`,
        headers: { Authorization: "Bearer " + req.user.accessToken },
      });
      let contents = road.data.file.contents;
      User.findById(req.user._id).then(async (user) => {
        const pageIds = user.pageIds;
        await Promise.all(
          contents.selectedSubjects.map(async (subject) => {
            try {
              console.log(subject);
              const page = await Page.findOne({ pageType: "Class", name: subject.id });
              if (!page) {
                return;
              }
              let isUserPage = pageIds.find((element) => {
                element.pageId == page._id;
              });
              if (!isUserPage) {
                user.pageIds.push({
                  pageId: page._id + "",
                  semester: "fall-2021",
                });
              }
              return page;
            } catch (err) {
              console.log(err.message);
              return;
            }
          })
        );
        user.isSiteAdmin = !user.isSiteAdmin;
        user.save().then((user1) => {
          console.log(user1);
          res.send({ user1 });
        });
      });
    } else {
      res.send({});
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in signing contract" });
  }
}

async function verify(req, res) {
  try {
    let verifyData = await axios({
      url: process.env.FIREROAD_LINK + "verify",
      headers: { Authorization: "Bearer " + req.user.accessToken },
    });
    console.log(verifyData.data, "verifyData");
    res.send({});
  } catch (err) {
    console.log(err.message);
    res.send({});
  }
}

async function userInfo(req, res) {
  try {
    let userData = await axios({
      url: process.env.FIREROAD_LINK + "user_info",
      headers: { Authorization: "Bearer " + req.user.accessToken },
    });
    console.log(userData.data, "userData");
    res.send({});
  } catch (err) {
    console.log(err.message);
    res.send({});
  }
}

async function roads(req, res) {
  try {
    let roadData = await axios({
      url: process.env.FIREROAD_LINK + "sync/roads",
      headers: { Authorization: "Bearer " + req.user.accessToken },
    });
    res.send({
      roads: roadData.data.files,
      yearOptions: ["2020", "2021", "2022", "2023", "2024", "2025"],
    });
  } catch (err) {
    console.log(err.message);
    res.send({ roads: {}, yearOptions: ["2020", "2021", "2022", "2023", "2024", "2025"] });
  }
}

module.exports = {
  sync,
  verify,
  userInfo,
  roads,
};
