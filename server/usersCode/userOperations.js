const User = require('./userSchema')

//const auth = require('authentication')
const { sendWelcomeEmail, sendCancelationEmail } = require('./emailSender')

async function signUpUser({username, email, password, confirmPassword}) {
    if (password !== confirmPassword)
        throw new Error("Password and confirm password does not match")
    const user = new User({username, email, password})
    await user.save()
    const token = await user.generateAuthToken()
    return {user, token}
}

async function logInUser({usernameOrMail, password}) {
    const user = await User.findByCredentials(usernameOrMail, password)
    const token = await user.generateAuthToken()
    return {user, token}
}

async function getAllUsers() {
    return await User.find({})
}

module.exports = {
    signUpUser,
    logInUser,
    getAllUsers,
    /*getUser,*/
}