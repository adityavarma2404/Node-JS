const fs = require('fs');

//if there is another middleware then it goes to it, else goes to execution part
function logReqRes(fileName){
    return (req,res,next) =>{
        fs.appendFile(fileName,
            `\n ${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,
            (err, data) =>{
                next()
            }
        )
    }
}

module.exports = {logReqRes}