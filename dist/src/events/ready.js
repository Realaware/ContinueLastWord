"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event = {
    name: "ready",
    run: (client) => {
        var _a;
        console.log(`logged in ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    },
};
exports.default = event;
