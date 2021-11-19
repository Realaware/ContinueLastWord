"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_json_1 = __importDefault(require("../../config.json"));
const xmldom_1 = require("@xmldom/xmldom");
async function isValidWord(word) {
    var _a;
    const { data, status } = await axios_1.default.get(`https://krdict.korean.go.kr/api/search`, {
        params: {
            key: config_json_1.default.apikey,
            type_search: "search",
            part: "word",
            q: word,
            sort: "dict",
        },
        validateStatus: null,
    });
    if (status !== 200) {
        return false;
    }
    const doc = new xmldom_1.DOMParser().parseFromString(data, "text/xml");
    const item = doc.getElementsByTagName("item")[0];
    return !item
        ? false
        : ((_a = item.getElementsByTagName("word")[0].firstChild) === null || _a === void 0 ? void 0 : _a.nodeValue) === word;
}
exports.default = isValidWord;
