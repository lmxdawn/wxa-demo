import { request } from "../../utils/httpUtils";

const userInfo = function (data) {
    return request("/api/user/user/userInfo", "GET", data)
};
module.exports = {
    userInfo,
}