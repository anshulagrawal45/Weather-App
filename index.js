const http = require("http");
const fs = require("fs");
var requests = require("requests");
const api = "http://api.weatherstack.com/current?access_key=87ffacb78db3b2d17cb6503cf8f421fc&query=Chennai" ;
const injectData = (html,obj)=>{
    let page = html.replace("{%city%}",obj["location"]["name"]);
    page = page.replace("{%country%}", obj["location"]["country"]);
    page = page.replace("{%temp%}", obj["current"]["temperature"]);
    page = page.replace("{%wind%}", obj["current"]["wind_speed"]);
    page = page.replace("{%humidity%}", obj["current"]["humidity"]);
    page = page.replace("{%isday%}", obj["current"]["is_day"]);
    page = page.replace("{%typeweather%}", obj["current"]["weather_descriptions"][0]);
    return page;
}
const server = http.createServer((req,res)=>{
    res.writeHead(200, {"content-type":"text/html"});
    var page = fs.readFileSync("index.html","utf-8");
    requests(api)
      .on("data", (chunk)=> {
        const obj = JSON.parse(chunk);
        page = injectData(page,obj);
      })
      .on("end", ()=> {
        res.end(page);
      });
});

server.listen(8000,"127.0.0.1",()=>{
    console.log("Server is listening at 8000 Port");
});