# Interstellar


![pic of interstellar](https://i.imgur.com/SyNU3iq.png)
## What is Interstellar

If you are a MIT student, check us out at https://www.interstellar.live ! (It requires MIT authentication to view)
Interstellar is a webapp created by MIT students (Akshaj, Daniel, Vivek, and Guang) for MIT students!

We started in January 2020, and the initial version was a site where you could join classes, see who else is in your class, as well as create groups with your friends to see what classes your friends are taking!

We upgraded the site in Fall 2020 to include (in master branch):

- Share classes: share what classes you’ve pre-registered for within group pages and see what other people are planning on taking.
- PSET sessions:  Join a Gather.town lounge while you’re working on a class’s PSET
- Share resources: share useful links, study guides, and class due dates
- Student-only forum: ask questions in a forum related to your class or group, or just to post memes that aren’t Piazza-friendly

Currently, we axed some features and the site now lets you see the courseroads (what MIT courses your friends are planning on taking/have taken in past and future semesters) of your friends, as well as see who you will share classes with. 


## Development

## Installing

### Requirements
- [mongoDB](https://www.mongodb.com/)
- [nodejs 16.0.0](https://nodejs.org/en/)

### Getting it up and running

#### Server
1. From repo root, install packages with `npm install`
1. Start mongodb with `mongod --dbpath <path_to_repo_root>/mongodump-test-db`
1. Create a `.env` file in the repository root, and place the following in it:
```ini
ATLAS_SRV="mongodb://127.0.0.1:27017"
DATABASE_NAME="test"
FIREROAD_LINK="https://fireroad-dev.mit.edu/"
```
1. In another terminal, run `npm start`

#### Client
1. From repo root, run `npm run start` to start a server providing the client
1. Navigate to the indicated address (probably `http://localhost:5000/`)
