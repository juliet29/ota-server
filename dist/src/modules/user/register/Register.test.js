"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testConn_1 = require("../../../test-utils/testConn");
const gCall_1 = require("../../../test-utils/gCall");
const faker_1 = __importDefault(require("faker"));
const User_1 = require("../../../entity/User");
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = yield testConn_1.testConn();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield conn.close();
}));
const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    username
    email
  }
}
`;
describe("Register", () => {
    it("create user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: faker_1.default.internet.userName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
        };
        const response = yield gCall_1.gCall({
            source: registerMutation,
            variableValues: {
                data: user,
            },
        });
        if (response.errors) {
            console.log(response.errors[0].originalError);
        }
        expect(response).toMatchObject({
            data: {
                register: {
                    username: user.username,
                    email: user.email,
                },
            },
        });
        const dbUser = yield User_1.User.findOne({ where: { email: user.email } });
        expect(dbUser).toBeDefined();
        expect(dbUser.confirmed).toBeFalsy();
        expect(dbUser.username).toBe(user.username);
    }));
});
//# sourceMappingURL=Register.test.js.map