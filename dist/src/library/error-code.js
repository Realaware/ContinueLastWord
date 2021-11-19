"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ERRORS = ["Failed To Join", "Already Playing", "No Players", "Failed To Find Last Character", "Unknown Room"];
function getError(code) {
    return `Error Code ${code}. (${ERRORS[code - 1]})`;
}
exports.default = getError;
