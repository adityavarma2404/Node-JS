const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("newSale", ()=>{
    console.log("New sale, flat 100% off");
})
myEmitter.on("newSale", ()=>{
    console.log("2nd listener");
})

myEmitter.emit("newSale");
