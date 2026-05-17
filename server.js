const express = require('express');
const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const MenueItem = require('./models/MenueItem');

app.get('/', function (req, res){
    res.send('Welcome to our Hotel... How can we help you? , we have list of menues for you to choose from');
});


const personRoutes = require('./Routes/personRoutes');
app.use('/person', personRoutes);

const menueRoutes = require('./Routes/menueRoutes');
app.use('/menue', menueRoutes);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});