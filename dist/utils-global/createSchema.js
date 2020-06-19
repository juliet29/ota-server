"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSchema = void 0;
const type_graphql_1 = require("type-graphql");
exports.CreateSchema = () => type_graphql_1.buildSchema({
    resolvers: [__dirname + "/../modules/*/*.ts"],
    authChecker: ({ context: { req } }) => {
        return !!req.session.userId;
    },
});
//# sourceMappingURL=createSchema.js.map