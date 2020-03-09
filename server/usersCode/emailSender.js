const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'drorbiren@gmail.com',
        subject: 'Thanks for joining in! (checkers-world)',
        text: `Welcome to the checkers world of Dror, ${name}! 
        A wonderful world of checkers is waiting just for you.`
    })
}

const sendCancelationEmail = (email, username) => {
    sgMail.send({
        to: email,
        from: 'drorbiren@gmail.com',
        subject: 'Sorry to see you go! (checkers-world)',
        text: `Goodbye, ${username}. I hope to see you back sometime soon :(`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}