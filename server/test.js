
const User = require('.usersCode/userSchema')

//const auth = require('authentication')


/*
const user1 = new User({
    username: "Droriii",
    password: "banana3",
    email: "ttttttttttttttt@gmail.com"
})

user1.save()
.then(()=>console.log("good"))
.catch(()=>console.log("bad"))
*/

printAllUsers()

async function printAllUsers() {
    const allUsers = await User.find({})
    console.log(allUsers)
}




