// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model.js')

const server = express();

server.use(express.json());

/* When the client makes a GET request to /api/users:

If there's an error in retrieving the users from the database:
respond with HTTP status code 500.
return the following JSON object: { message: "The users information could not be retrieved" }. */ 

server.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json({message: "The users information could not be retrieved" })
    }
})

/* When the client makes a GET request to /api/users/:id:

If the user with the specified id is not found:

respond with HTTP status code 404 (Not Found).
return the following JSON object: { message: "The user with the specified ID does not exist" }.
If there's an error in retrieving the user from the database:

respond with HTTP status code 500.
return the following JSON object: { message: "The user information could not be retrieved" }. */

server.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if(!user) {
            res.status(404).json({message: "The user with the specified ID does not exist"})
        } else {
            res.status(200).json(user);
        }
    } catch(err) {
        res.status(500).json({message: "The user information could not be retrieved"})
    }
})


/* When the client makes a POST request to /api/users:

If the request body is missing the name or bio property:
    => respond with HTTP status code 400 (Bad Request).
    => return the following JSON response: { message: "Please provide name and bio for the user" }.

If the information about the user is valid:
    => save the new user the the database.
    => respond with HTTP status code 201 (Created).
    => return the newly created user document including its id.

If there's an error while saving the user:
    => respond with HTTP status code 500 (Server Error).
    => return the following JSON object: { message: "There was an error while saving the user to the database" }. */

server.post("/api/users", async (req, res) => {
    try {
        const { name, bio } = req.body;
        if(!name || !bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" })
        } else {
            const newUser = await User.insert({name, bio});
            res.status(201).json(newUser);
        }
    } catch(err) {
        res.status(500).json({ message: "There was an error while saving the user to the database" })
    }
})



module.exports = server;