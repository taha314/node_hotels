const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const { jwtAuthMiddleware, generateToken } = require('../jwt');



router.post('/signup', async (req, res) => {

    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log("Person added successfully:");
        const payload ={
            id: response._id,
            username: response.username
        }

        console.log("Payload for JWT token:", payload);
        const token = generateToken(payload);
        console.log("Generated JWT token:", token);
        res.status(200).json({response: response, token: token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the person.' });
    }

});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Person.findOne({ username: username });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // Generate JWT token
        const payload = {
            id: user.id,
            username: user.username
        };

        const token = generateToken(payload);
        
        res.json({ token });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

// profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user; // This will contain the decoded JWT payload
        console.log("User data:", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the profile.' });
    }
});


router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const people = await Person.find();
        console.log("People fetched successfully:");
        res.status(200).json(people);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the people.' });
    }
});


router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        if (workType == 'chef' || workType == 'waiter' || workType == 'manager' || workType == 'CEO') {
            const response = await Person.find({ work: workType });
            console.log(`People with work type ${workType} fetched successfully:`);
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'Invalid work type.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the people.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const updatedPersonData = req.body;
        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true
        });
        if (!response) {
            res.status(404).json({ error: 'Person not found.' });
        }
        console.log("Person updated successfully:");
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the person.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);
        if (!response) {
            res.status(404).json({ error: 'Person not found.' });
        }
        console.log("Person deleted successfully:");
        res.status(200).json('Person deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the person.' });
    }
});

module.exports = router;