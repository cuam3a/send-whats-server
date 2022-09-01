const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const routers = require('./app/routers/api');
const app = express();

var corsOptions = {
    origin: "*"
};

app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
})
app.use(cors(corsOptions));

// const db = require("./app/models");
// db.sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/", (req, res) => {
//     res.json({ message: "HOLA, ESTOY EN VERCEL" })
// })
// app.use('/login', async (req, res) => {
//     const { user, pass } = req.body.data
//     let db = fs.readFileSync('./app/config/data.json');
//     let data = JSON.parse(db);
//     let existUser = data.users.find(ele => ele.user == user && ele.pass == pass);
//     if (existUser == null) {
//         return res.status(400).send("ERROR USUARIO o PASSWORD")
//     }
//     return res.status(200).send({ success: "OK", id: existUser.id })
// })
app.use('/api', routers);

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;