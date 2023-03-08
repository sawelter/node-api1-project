// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model.js')

const server = express();

server.use(express.json());

// Get ALL users
server.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json({message: "The users information could not be retrieved" })
    }
})

// Get a specific user using their id
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

// Post a user (requires name and bio params)
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


// Delete a user by id
server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.remove(id);
        if(!deletedUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            res.status(200).json(deletedUser);
        }
    } catch(err) {
        res.status(500).json( {
            message: "The user could not be removed"
        })
    }
})


/* 
If the user with the specified id is not found:
    respond with HTTP status code 404 (Not Found).
    return the following JSON object: { message: "The user with the specified ID does not exist" }.

If the request body is missing the name or bio property:
    respond with HTTP status code 400 (Bad Request).
    return the following JSON response: { message: "Please provide name and bio for the user" }.

If the user is found and the new information is valid:
    update the user document in the database using the new information sent in the request body.
    respond with HTTP status code 200 (OK).
    return the newly updated user document. */

// Update a user with id, name, and bio
server.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    try {
        if(!name || !bio) {
            res.status(400).json({message: "Please provide name and bio for the user"})
        } else {
            const updatedUser = await User.update(id, {name, bio});
            if(!updatedUser) {
                res.status(404).json({message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(updatedUser);
            }
        }
    } catch(err) {
        res.status(500).json( {
            message: "The user could not be modified"
        })
    }
})

module.exports = server;