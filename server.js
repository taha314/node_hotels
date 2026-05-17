const express = require('express');
const app = express();
const db = require('./db').default;
require('dotenv').config();
const passport = require('passport');
const person = require('./models/person');
const LocalStrategy = require('passport-local').Strategy;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Middleware fuction
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`);
    next();
};
app.use(logRequest);

passport.use(new LocalStrategy(async (USERNAME, password, done) => {
    try{
        console.log("Recieved CREDENTIALS:", USERNAME, password);
        const user = await person.findOne({ username: USERNAME });
        if (!user)
            return done(null, false, { message: 'Incorrect username.' });
        
        const isPasswordValid = user.password === password ? true : false;
        if (isPasswordValid) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    }
    catch(err){
        return done(err);
    }
}));

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local', { session: false });

const MenueItem = require('./models/MenueItem');

app.get('/', localAuthMiddleware , function (req, res) {
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