const experss = require('express');
const router = experss.Router();
const MenueItem = require('../models/MenueItem');


router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newMenueItem = new MenueItem(data);
        const response = await newMenueItem.save();
        console.log("Menue item added successfully:");
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the menue item.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const menueItems = await MenueItem.find();
        console.log("Menue items fetched successfully:");
        res.status(200).json(menueItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the menue items.' });
    }
});

router.get('/:tasteType', async (req, res) => {
    try {
        const tasteType = req.params.tasteType;
        if (tasteType == 'sweet' || tasteType == 'salty' || tasteType == 'spicy' || tasteType == 'sour') {
            const response = await MenueItem.find({ taste: tasteType });
            console.log(`Menue items with taste ${tasteType} fetched successfully:`);
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'Invalid taste.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the menue items.' });
    }
});
module.exports = router;