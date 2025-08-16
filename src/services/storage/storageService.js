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

    removeUserInfo = () => {
        const key = this.ENUM.CUSTOMER_INFO;
        return localStorageService.remove(key);
    };

    // إضافة دالة لمسح كل التخزين
    deleteAll = () => {
        localStorage.clear();   // بتمسح كل الـ localStorage
        sessionStorage.clear(); // لو بدك كمان تمسح الـ sessionStorage
    };
}

export default new StorageService();
