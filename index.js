import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
  res.render("index.ejs")
})

app.post("/search",async(req,res)=>{
  const satName = req.body.sat;
  const response = await axios.get(`https://celestrak.org/NORAD/elements/gp.php?NAME=${satName}&FORMAT=TLE`);
  const tleLines = response.data.split("\n").slice(1).join("\n");
  console.log(tleLines);
  res.render("index.ejs")
})

app.listen(3000,()=>{
  console.log(`server is running in port 3000`);
})