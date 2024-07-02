const fs = require("fs");

setTimeout(()=>console.log("Timer 1"),10);

fs.readFile(__filename,()=>{
    console.log("File reader")
});