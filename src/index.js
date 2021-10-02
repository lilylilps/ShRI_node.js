const express = require('express');
const database = require('./entities/database');
const Image = require('./entities/image');
const fsWorker = require('./utils/fsWorker');
const config = require('./config/config')

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { replaceBackground } = require("backrem");

const app = express();

app.use(express.json());

app.get('/list', (req, res) => {
    const allImages = database.getAll().map((image) => image.toPublicJSON());

    return res.json(allImages);
});

app.get('/image/:id', (req, res) => {
    const imgId = req.params.id;

    if (!database.getImage(imgId)) {
        return res.sendStatus(404);
    }

    const image = database.getImage(imgId);

    const stream = fsWorker.getReadFileStream(image.id);

    res.setHeader('Content-Type', `${image.contentType}`);
    return stream.pipe(res);
});

app.get('/merge', (req, res) => {
    const imgFrontId = req.query.front;
    const imgBackId = req.query.back;
    const color = req.query.color;
    const threshold = req.query.threshold;

    if (!imgFrontId || !imgBackId) {
        return res.sendStatus(400);
    } else if (!database.getImage(imgFrontId) || !database.getImage(imgBackId)) {
        return res.sendStatus(404);
    }

    const imgFront = fsWorker.getReadFileStream(imgFrontId);
    const imgBack = fsWorker.getReadFileStream(imgBackId);

    replaceBackground(imgFront, imgBack, color.split(','), threshold)
        .then(
            (readableStream) => {
                res.setHeader('Content-Type', 'image/jpeg');
                return readableStream.pipe(res);
            }
        )
        .catch(() => {
            res.sendStatus(400);
        })
});

app.post('/upload', upload.single('image'), async (req, res) => {
    const content = req.file;
    const image = new Image(null, content.size, null, content.mimetype);
    database.insert(image);

    await fsWorker.writeFile(image.id, content.buffer);

    return res.json({ id: image.id });
});

app.delete('/image/:id', async (req, res) => {
    const imgId = req.params.id;

    if (!database.getImage(imgId)) {
        return res.sendStatus(404);
    }

    database.remove(imgId);

    await fsWorker.removeFile(imgId);

    return res.json({ id: imgId });
});

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});