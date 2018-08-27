//Dependencies/Schema ref
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

//Creating Schema
let UserSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        unique: true,
        required: "Username is required"
    },
    password: {
        type: String,
        trim: true,
        required: "Password is required",
        validate: [
            function(input) {
                return input.length >= 6;
            },
            "Password needs to be at least 6 characters long"
        ]
    },
    // email: {
    //     type: String,
    //     trim: true,
    //     unique: true,
    //     match: [/.+@.+\..+/, "Please ender a valid e-mail"]
    // },
    userCreated: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function(next) {
    console.log("This", this)
    if(this.isModified('password') || this.isNew) {
        bcrypt.hash(this.password, 10, (err, hash) => {
            if(err) { return next(err); }
            this.password = hash;
            return next();
        })
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(hashPwd, cb) {
    bcrypt.compare(hashPwd, this.password, function(err, isMatch) {
        cb(null, isMatch);
    });
};

const User = mongoose.model("User", UserSchema);

module.exports = User