const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")


// console.log(__dirname)
// console.log(path.join(__dirname, "../public"))
const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewPath = path.join(__dirname, "../templates/views")

const partialPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine views location
app.set("view engine", "hbs")
app.set("views", viewPath)
hbs.registerPartials(partialPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
  res.render('index', {
    title: "Weather App",
    name: "Urja Thakur"
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Urja Thakur"
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    helptext: "This is some helpful text",
    title: "Help",
    name: "Urja Thakur"
  })
})

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Your must provide an address"
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, description } = {}) => {
    if (error) {
      return res.send({ error })
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
        location: description,
        address: req.query.address
      })
    })
  })
})





app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    })
  }
  console.log(req.query.search)
  res.send({
    products: []
  })
})
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Urja Thakur",
    errorMessage: "Help article not found"
  })
})
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Urja Thakur",
    errorMessage: "Page not found"
  })
})

// app.com
// app.com/hello
// app.com/about

app.listen(port, () => {
  console.log(`server is up on port ${port} `)
})