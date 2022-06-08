const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();
const requests = require('requests');
// const EventEmitter = require('events');
// const emitter = new EventEmitter();
const homeFile = fs.readFileSync('./home.html','utf-8')

const replaceVal = (tempVal,orgVal)=>{
   let temp = tempVal.replace("{%tempVal%}",(orgVal.main.temp-273).toFixed(2))
   temp = temp.replace("{%tempMin%}",(orgVal.main.temp_min-273).toFixed(2))
   temp = temp.replace("{%tempMax%}",(orgVal.main.temp_max-273).toFixed(2))
   temp = temp.replace("{%city%}",orgVal.name)
   temp = temp.replace("{%country%}",orgVal.sys.country)

   return temp;
}

app.get('/',(req,res) =>{
  
  requests('https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=d4521a823f2019276eb54439da75dbaf')
  .on('data',(chunk) =>{
    const objData = JSON.parse(chunk);
    const arr = [objData];
    // console.log(objData.main.temp);

     const realData = arr.map((val) => replaceVal(homeFile,val)).join('');

    //  console.log(realData);
     res.send(realData);

  })
  .on('end',(err) =>{
    if(err)
    console.log('connetion lost');

    console.log('END');
  }) 
})


app.listen(5000,() =>{
  console.log('server listening at port 5000');
})