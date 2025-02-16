import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

function parseTLE(response) {
  // Split the response into lines and remove extra spaces
  const lines = response.trim().split("\r\n");

  let satellites = [];

  for (let i = 0; i < lines.length; i += 3) {
    const name = lines[i].trim(); // Satellite Name
    const tle1 = lines[i + 1].trim(); // First TLE line
    const tle2 = lines[i + 2].trim(); // Second TLE line

    if (tle1 && tle2) {
      satellites.push({
        name: name,
        tle: `${tle1}\n${tle2}` // Store as multi-line string
      });
    }
  }

  return satellites;
}

app.get("/",async(req,res)=>{
  const response = await axios.get(`https://celestrak.org/NORAD/elements/gp.php?NAME=ISS (ZARYA)&FORMAT=TLE`);
  const tleLines = response.data.split("\n").slice(1).join("\n");
  const resp = await axios.get("https://celestrak.org/NORAD/elements/gp.php?GROUP=ACTIVE&FORMAT=TLE");
  //console.log(resp.data);
  const tleArray = parseTLE(resp.data);
  //console.log(tleArray);
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