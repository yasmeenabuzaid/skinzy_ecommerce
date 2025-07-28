const axios = require("axios");
const {
    default: localStorageService,
} = require("../storage/localStorageService");

class Request {
    async request(config) {
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorageService.deleteAll();
                return error.response.data;
            } else {
                console.log("Request error:", error.message);
            }
            return error.response?.data;
        }
    }

    get(config) {
        return this.request({ method: "GET", ...config });
    }

    post(config) {
        return this.request({ method: "POST", ...config });
    }

    put(config) {
        return this.request({ method: "PUT", ...config });
    }

    delete(config) {
        return this.request({ method: "DELETE", ...config });
    }

    patch(config) {
        return this.request({ method: "PATCH", ...config });
    }
}

module.exports = new Request();
