
function identifiedToken(callbackWhenIdentified) {
    socket.emit('findUserByToken', getToken(), (error, user) => {
        if (error) {
            shiftPageAndPreserveToken('index','')
            alert("authentication for user have failed")
        }
        else {
            console.log('token identified successfully!\n user:',user)
            callbackWhenIdentified(user)
        }
    })
}

function getToken() {
    const url = window.location.href
    const tokenIndex = 1+url.indexOf('?')
    return url.substring(tokenIndex)
}

function shiftPageAndPreserveToken(pageName, token=getToken()) {
    window.location.href = pageName + ".html?" + token
}