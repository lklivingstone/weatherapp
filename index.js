const express= require("express")
const cors= require("cors")
const app= express()

app.use(cors({
    credentials: true,
    origin: true
}))

app.use(express.json())

const weatherRoute= require("./routes/weather")

app.use("/api/weather", weatherRoute)

app.listen(process.env.PORT || 5000, ()=> {
    console.log("Listening on port: 5000")
})