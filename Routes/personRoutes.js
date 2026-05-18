const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const e = require('express');



router.post('/', async (req, res) => {

    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log("Person added successfully:");
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the person.' });
    }

});

router.get('/', async (req, res) => {
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