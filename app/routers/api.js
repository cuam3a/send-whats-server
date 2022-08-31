const router = require('express').Router();
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
var path = require("path");
//import {WAWebJS} from 'whatsapp-web.js';

router.get('/test', (req, res) => {
    res.send({ success: "OK" })
})

router.post('/login', async (req, res) => {
    const { user, pass } = req.body.data
    const dir = path.resolve(process.cwd(), "app");
    //let db = fs.readFileSync('/app/config/data.json');path.join(configDirectory, "eBayJson.json")
    let db = fs.readFileSync(path.join(dir, 'config/data.json'));
    let data = JSON.parse(db);
    let existUser = data.users.find(ele => ele.user == user && ele.pass == pass);
    if (existUser == null) {
        return res.status(400).send("ERROR USUARIO o PASSWORD")
    }
    return res.status(200).send({ success: "OK", id: existUser.id })
})

router.post('/connect', async (req, res) => {
    console.log("CONNECT")
    const { id } = req.body.data
    const dir = path.resolve(process.cwd(), "app");
    //let db = fs.readFileSync('./app/config/data.json');
    let db = fs.readFileSync(path.join(dir, 'config/data.json'));
    let data = JSON.parse(db);
    let existUser = data.users.find(ele => ele.id == id);
    if (existUser == null) {
        return res.status(400).send("NO EXISTE USUARIO")
    }

    try {
        const client = new Client({ authStrategy: new LocalAuth({ clientId: id, dataPath: dir }) });
        client.initialize();
        client.on('ready', () => {
            console.log("READY")
            client.destroy();
            sleepFor(3000)
            return res.status(200).send({ success: "OK" });
        });
        client.on('auth_failure', () => {
            console.log("FAILURE")
            client.destroy();
            sleepFor(3000)
            return res.status(400).send({ error: "OK" });
        })
        client.on('disconnected', () => {
            console.log("FAILURE")
            client.destroy();
            sleepFor(3000)
            return res.status(400).send({ error: "OK" });
        })
        client.once('qr', (qr) => {
            console.log("QR")
            res.send({ success: "Ok", qr: qr });
        });
    }
    catch (e) {
        console.log(e)
        return res.status(400).send({ error: e });
    }
    //return res.status(200).send({ success: "OK", qr: true });
})

router.post('/getConfig', async (req, res) => {
    const { id } = req.body.data
    const dir = path.resolve(process.cwd(), "app");
    //let db = fs.readFileSync('./app/config/data.json');
    let db = fs.readFileSync(path.join(dir, 'config/data.json'));
    let data = JSON.parse(db);
    let existUser = data.users.find(ele => ele.id == id);
    if (existUser == null) {
        return res.status(400).send("NO EXISTE USUARIO")
    }
    let existConfig = data.config.find(ele => ele.idUser == id);
    if (existConfig == null) {
        return res.status(400).send("NO EXISTE CONFIGURACION")
    }
    console.log(existConfig)
    return res.status(200).send({ success: "OK", config: existConfig })
})

router.post('/setConfig', async (req, res) => {
    const { id, config } = req.body.data
    console.log(config)
    //let db = fs.readFileSync('./app/config/data.json');
    const dir = path.resolve(process.cwd(), "app");
    let db = fs.readFileSync(path.join(dir, 'config/data.json'));
    let data = JSON.parse(db);
    let existUser = data.users.find(ele => ele.id == id);
    if (existUser == null) {
        return res.status(400).send("NO EXISTE USUARIO")
    }
    let existConfig = data.config.find(ele => ele.idUser == id);
    if (existConfig == null) {
        return res.status(400).send("NO EXISTE CONFIGURACION")

    }
    existConfig.numberMessage = parseInt(config.numberMessage);
    existConfig.timeSleep = parseInt(config.timeSleep);
    existConfig.timeSleepEveryMessage = parseInt(config.timeSleepEveryMessage);
    existConfig.timeSendMessage = parseInt(config.timeSendMessage);
    existConfig.message = config.message;
    existConfig.param1 = config.param1;
    existConfig.param2 = config.param2;
    existConfig.param3 = config.param3;
    existConfig.param4 = config.param4;
    existConfig.param5 = config.param5;

    console.log("NEW DATA")
    console.log(data)
    //fs.writeFileSync('./app/config/data.json', JSON.stringify(data));
    fs.writeFileSync(path.join(dir, 'config/data.json'), JSON.stringify(data));
    return res.status(200).send({ success: "OK" })
})

router.post('/sendMessages', async (req, res) => {
    const { id, contacts, number } = req.body.data
    //let db = fs.readFileSync('./app/config/data.json');
    const dir = path.resolve(process.cwd(), "app");
    let db = fs.readFileSync(path.join(dir, 'config/data.json'));
    let data = JSON.parse(db);
    let existUser = data.users.find(ele => ele.id == id);
    if (existUser == null) {
        return res.status(400).send("NO EXISTE USUARIO")
    }
    let existConfig = data.config.find(ele => ele.idUser == id);
    if (existConfig == null) {
        return res.status(400).send("NO EXISTE CONFIGURACION")
    }

    const client = new Client({ puppeteer: { headless: false, args: ['--disable-dev-shm-usage'] }, authStrategy: new LocalAuth({ clientId: id, dataPath: dir }) });
    client.initialize();
    client.on('ready', async () => {
        console.log('READY');

        let message = existConfig.message;
        let param1 = existConfig.param1;
        let param2 = existConfig.param2;
        let param3 = existConfig.param3;
        let param4 = existConfig.param4;
        let param5 = existConfig.param5;
        let valueParam1 = 0;
        let valueParam2 = 0;
        let valueParam3 = 0;
        let valueParam4 = 0;
        let valueParam5 = 0;
        let count = 0;
        let total = 0;
        for (i = 0; i < contacts.length; i++) {
            //await req.body.contacts.forEach(async item => {
            //let tiempo = Math.floor(Math.random() * (12000 - 7800)) + 7800;
            count++;
            if (count === existConfig.numberMessage) {
                await sleepFor(existConfig.timeSleep * 1000);
                count = 0;
            }
            let tiempo = existConfig.timeSleepEveryMessage * 1000;
            await sleepFor(tiempo);
            const p1 = param1[valueParam1];
            const p2 = param2[valueParam2];
            const p3 = param3[valueParam3];
            const p4 = param4[valueParam4];
            const p5 = param5[valueParam5];
            valueParam1++;
            if (valueParam1 >= param1.length) {
                valueParam1 = 0;
            }
            valueParam2++;
            if (valueParam2 >= param2.length) {
                valueParam2 = 0;
            }
            valueParam3++;
            if (valueParam3 >= param3.length) {
                valueParam3 = 0;
            }
            valueParam4++;
            if (valueParam4 >= param4.length) {
                valueParam4 = 0;
            }
            valueParam5++;
            if (valueParam5 >= param5.length) {
                valueParam5 = 0;
            }
            let number = `${contacts[i].number}@c.us`;
            //const message = message.replace("{param1}", p1).replace("{param2}", p2)//req.body.message;

            var id = await client.sendMessage(number, message.replace(/{param1}/g, p1).replace(/{param2}/g, p2).replace(/{param3}/g, p3).replace(/{param4}/g, p4).replace(/{param5}/g, p5), { sleepDuration: (existConfig.timeSendMessage * 1000) });
            var fecha = new Date(Date.now())
            console.log(fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getMilliseconds() + " ENVIADO A " + number + " t:" + tiempo + " ID:" + JSON.stringify(id));
            total++;
            //});
        }
        client.sendMessage(`${number}@c.us`, "WA LISTO");

        client.destroy();
        sleepFor(3000)
        return res.status(200).send({ success: "OK" });
    });

    //return res.status(200).send({ success: "OK" })
})

function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
        /* Do nothing */
    }
}

router.post('/getqr', async (req, res) => {
    const { id } = req.body.data
    //let db = fs.readFileSync('./app/config/data.json');
    const dir = path.resolve(process.cwd(), "app");
    let db = fs.readFileSync(path.join(dir, 'config/data.json'));
    let data = JSON.parse(db);
    let existUser = data.users.find(ele => ele.id == id);
    if (existUser == null) {
        return res.status(400).send("NO EXISTE USUARIO")
    }

    const client = new Client({ authStrategy: new LocalAuth({ clientId: id, dataPath: dir }) });
    client.initialize();
    client.once('qr', (qr) => {
        res.send({ success: "Ok", qr: qr });
    });

    client.once('authenticated', async () => {
        console.log('AUTHENTICATED');
    });

    client.on('ready', () => {
        console.log('READY');
        client.destroy();
        return res.status(200).send({ success: "OK" });
    });

    client.on('auth_failure', () => {
        console.log('FAILURE');
        client.destroy();
        return res.status(200).send({ error: "ERROR INICIO SESION" });
    })
})

module.exports = router;