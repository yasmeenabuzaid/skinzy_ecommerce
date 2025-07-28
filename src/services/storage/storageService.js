import localStorageService from "./localStorageService";

class StorageService {
    ENUM = {
        CUSTOMER_INFO: "customerInfo",
    };

    // LOCAL STORAGE
    getUserInfo = () => {
        const key = this.ENUM.CUSTOMER_INFO;
        return localStorageService.getObject(key);
    };

    setUserInfo = (data) => {
        const key = this.ENUM.CUSTOMER_INFO;
        return localStorageService.saveObject(key, data);
    };

    // SESSION STORAGE
}

export default new StorageService();
