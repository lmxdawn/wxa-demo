import { request } from "../../utils/httpUtils"
const test = function (data) {
    return request("/api/test/test" + 1, "GET", data)
};

module.exports = {
    test,
};