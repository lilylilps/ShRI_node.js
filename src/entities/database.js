const { EventEmitter } = require('events');
const Image = require('./image');

class Database extends EventEmitter {
    constructor() {
        super();

        this.images = {};
    }

    getAll() {
        let allImages = Object.values(this.images);

        // allSvgs.sort((svgA, svgB) => svgB.createdAt - svgA.createdAt);

        return allImages;
    }

    getImage(imgId) {
        const imgRaw = this.images[imgId];

        if (!imgRaw) {
            return null;
        }

        const image = new Image(imgRaw.id, imgRaw.size, imgRaw.createdAt, imgRaw.contentType);

        return image;
    }

    remove(imgId) {
        delete this.images[imgId];
    }

    insert(image) {
        this.images[image.id] = image;
    }

    // exists(imgId) {
    //     return imgId in this.images;
    // }
}

const database = new Database();
module.exports = database;