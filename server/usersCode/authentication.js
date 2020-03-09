const jwt = require('jsonwebtoken')
const User = require('./userSchema')

const findUserByToken = async (token) => {
    const decoded = jwt.verify(token, "thisisasecretformyapp") //process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token })

    if (!user) {
        console.log("Authentication failed")
        throw new Error("Authentication failed")
    }
    return user
}

module.exports = findUserByToken