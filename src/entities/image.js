const { generateId } = require('../utils/generateId');

module.exports = class Image {
    constructor(id, size, createdAt, contentType) {
        this.id = id || generateId();
        this.size = size;
        this.createdAt = createdAt || Date.now();
        this.contentType = contentType;
    }

    toPublicJSON() {
        return {
            id: this.id,
            size: this.size,
            createdAt: this.createdAt,
        };
    }
}