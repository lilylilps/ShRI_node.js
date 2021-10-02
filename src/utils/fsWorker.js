const fs = require('fs');

class FsWorker {
    constructor(path) {
        this.path = path;
    }

    async writeFile(imgId, content) {
        await fs.promises.writeFile(`${this.path}/${imgId}`, content);
    }

    getReadFileStream(imgId) {
        return fs.createReadStream(`${this.path}/${imgId}`);
    }

    async removeFile(imgId) {
        await fs.promises.unlink(`${this.path}/${imgId}`);
    }
}

const fsWorker = new FsWorker('./uploads');
module.exports = fsWorker;