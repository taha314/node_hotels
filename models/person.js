const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager', "CEO"],
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

personSchema.pre('save', async function(next) {
    const person = this;

    // Only hash the password if it has been modified (or is new)
    if (!person.isModified('password')) return next();

    try{
        // Hash the password
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        // Replace the plain text password with the hashed password
        person.password = hashedPassword;
        next();
    }
    catch(err){
        return (err);
    }
});

personSchema.methods.comparePassword = async function(candidatePassword) {
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    }
    catch(err){
        throw err;
    }
};

const Person = mongoose.model('Person', personSchema);

module.exports = Person;