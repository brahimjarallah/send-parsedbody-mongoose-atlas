require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const port = process.env.PORT || 3000

// mongoose.connect(<Your URI>, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

console.log("connection state => ", mongoose.connection.readyState)

const schema = new mongoose.Schema({ url: "string" })
const Url = mongoose.model("Url", schema)
app.use(bodyParser.urlencoded({ extended: false }))

// Basic Configuration

app.use(cors())

app.use("/public", express.static(`${process.cwd()}/public`))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

// Your first API endpoint
// app.get("/api/hello", function (req, res) {
//   res.json({ greeting: "hello API" })
// })


app.post("/api/shorturl", async (req, res) => {
  const url = new Url({ url: req.body.url })

    console.log(req.body)
    await Url.create({ url: req.body.url }, (err, data) => {
      res.json({ created: true })
    })
    res.json({
      original_url: req.body.url,
      short_url: 1,
    })

})

//1-  You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
//2- When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
//3- If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
