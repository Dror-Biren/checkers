require('../boringConfig/mongooseInit')
const mongoose = require('mongoose')

const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) 
                throw new Error('Email is invalid')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password') || value.includes('1234')) 
                throw new Error('Password too weak')
        }
    },
    rating: {
        type: Number,
        default: 1000,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ id: user._id.toString() }, "thisisasecretformyapp") //process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (usernameOrMail, password) => {
    const user = await User.findOne({ email: usernameOrMail })
    if (!user)
        user = await User.findOne({ username: usernameOrMail })

    if (!user)
        throw new Error('There is no email or user in our system named: '+usernameOrMail)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) 
        throw new Error('Wrong password')
    
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) 
        user.password = await bcrypt.hash(user.password, 8)

    next()
})


const User = mongoose.model('User', userSchema)
module.exports = User