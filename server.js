const express = require('express');
const app = express();
const db = require('./db').default;
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const MenueItem = require('./models/MenueItem');

app.get('/', function (req, res) {
    res.send('Welcome to our Hotel... How can we help you? , we have list of menues for you to choose from');
});


const personRoutes = require('./Routes/personRoutes');
app.use('/person', personRoutes);

const menueRoutes = require('./Routes/menueRoutes');
app.use('/menue', menueRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port 3000`);
});