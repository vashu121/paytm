const mongoose=require("mongoose");

const url="mongodb+srv://vashumaurya121:1HBqxSSNRrBTuhUT@payapp.yz4fbgb.mongodb.net/";
mongoose.connect(url)
.then(()=>{
    console.log("connected to the database");
})
.catch(err=>{
    console.error(`error connection to the database. n${err}`);
});

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
	User,
    Account
};