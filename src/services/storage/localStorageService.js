class LocalStorageService {
    get = (key) => {
        try {
            return localStorage.getItem(key);
        } catch (err) {
            return null;
        }
    };

    getObject = (key) => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            } else return {};
        } catch (err) {
            return {};
        }
    };

    saveObject = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (err) {
            return {};
        }
    };

    deleteAll = () => {
        localStorage.clear();
    };
}

export default new LocalStorageService();
