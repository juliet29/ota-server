"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSchema = void 0;
const GetCurrentUser_1 = require("../modules/user/GetCurrentUser");
const type_graphql_1 = require("type-graphql");
const ChangePassword_1 = require("../modules/user/ChangePassword");
const ConfirmUser_1 = require("../modules/user/ConfirmUser");
const ForgotPassword_1 = require("../modules/user/ForgotPassword");
const Login_1 = require("../modules/user/Login");
const Logout_1 = require("../modules/user/Logout");
const Register_1 = require("../modules/user/Register");
exports.CreateSchema = () => type_graphql_1.buildSchema({
    resolvers: [
        ChangePassword_1.ChangePasswordResolver,
        ConfirmUser_1.ConfirmUserResolver,
        ForgotPassword_1.ForgotPasswordResolver,
        Login_1.LoginResolver,
        Logout_1.LogoutResolver,
        GetCurrentUser_1.GetCurrentUserResolver,
        Register_1.RegisterResolver,
    ],
    authChecker: ({ context: { req } }) => {
        return !!req.session.userId;
    },
});
//# sourceMappingURL=createSchema.js.map