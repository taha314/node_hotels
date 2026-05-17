const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const person = require('./models/person'); // Adjust the path as needed

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

module.exports = passport; // Export configured passport