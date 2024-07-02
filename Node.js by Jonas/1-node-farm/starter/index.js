const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

// const inputText = fs.readFileSync("./txt/input.txt", 'utf-8');
// console.log(inputText);
// const outputText = "I hate Avocado's, I like only watermelon."
// fs.writeFileSync("./txt/output.txt",outputText);

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("caught an error");
//   fs.readFile(`./txt/${data1}.txt`,(err, data2) => {
//     fs.readFile("./txt/append.txt", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n$ ${data3} `, (err) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const objData = JSON.parse(data);

const server = http.createServer((req, res) => {
  // first we are getting the path from url and query ex: product?id=0
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    // we are iterating "card" element by passing the data, then adding this list to "overview" page.
    const cardsHtml = objData.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, objData[query.id]);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-typ": "text/html",
      "my-own-header": "my created header",
    });
    res.end("<h1> Page not found </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
