"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConn = void 0;
const typeorm_1 = require("typeorm");
exports.testConn = (drop = false) => {
    return typeorm_1.createConnection({
        name: "test",
        type: "postgres",
        host: "localhost",
        port: 5433,
        username: "julietnu",
        password: "mypass",
        database: "julietnutest",
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + "/../entity/*.*"],
    });
};
//# sourceMappingURL=testConn.js.map