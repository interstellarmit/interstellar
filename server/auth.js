const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
const socket = require("./server-socket");
const { useReducer } = require("react");

// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
const CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) return existingUser;
    let email_for_school = "MIT".toLowerCase()
    School.findOne({name: email_for_school}).then((school) => {
      const newUser = new User({
        name: user.name,
        googleid: user.sub,
        schoolId: school._id
      });
  
      return newUser.save();
    })
    
  });
}

/*
login
Input (req.body): {schoolName: String}
Precondition: 
Socket: 
Returns: {user: User, allPages: [Page]}
Description: Returns your user object, and all pages from their school (that aren't past expiry date). *Remove the password field from allPages*
*/
function login(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUser(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      Page.find({schoolId: user.schoolId, expiryDate: { $lt: Date.now() }}, (err, pages) => {
        res.send({user: user, allPages: pages});
      })
      
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

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

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
};
