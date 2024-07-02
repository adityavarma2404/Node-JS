const fs = require("fs");
const express = require("express");
const app = express();

// app.get('/',(req, res)=>{
//     res.status(200).send("Welcome to my API");
// });
// app.post('/',(req, res)=>{
//     res.send("Post doesnt work here");
// });

// const port = 3000;
// app.listen(port, ()=>{
//     console.log(`Server is running on port ${port}`);
// })

// const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours',(req, res)=>{
    res.status(200).json({
        status: 'success',
        data:{
            tours
        },
        results: tours.length
    });
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})