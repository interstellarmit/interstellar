let io;
const User = require("./models/user");
const Lounge = require("./models/lounge");
const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);

        if (user) {
          User.findById(user._id).then((myUser) => {
            if (myUser.loungeId === "") {
              removeUser(user, socket);
              return;
            }
            let oldLoungeId = myUser.loungeId;
            Lounge.findById(oldLoungeId).then((lounge) => {
              if (lounge.userIds.includes(user._id)) {
                console.log("hello");
                console.log(lounge.userIds.length);
                lounge.userIds = lounge.userIds.filter((id) => {
                  return id !== user._id;
                });
                console.log(lounge.userIds.length);
                lounge.save().then(() => {
                  getSocketFromUserID(user._id)
                    .to("Page: " + lounge.pageId)
                    .emit("userRemovedFromLounge", { loungeId: lounge._id, userId: user._id });
                  getSocketFromUserID(user._id).leave("Lounge: " + lounge._id);
                  myUser.loungeId = "";
                  myUser.save().then(() => {
                    removeUser(user, socket);
                  });
                });
              } else {
                removeUser(user, socket);
              }
            });
          });
        } else {
          removeUser(user, socket);
        }
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
