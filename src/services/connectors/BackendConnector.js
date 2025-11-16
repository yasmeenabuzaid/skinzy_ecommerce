import axios from "axios";
import { parse } from 'cookie';
// Config
import storageService from "../storage/storageService";
import requests from "./Request";

class BackendConnector {
    constructor() {
        this.axios = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    /**
     * Helper function to get user info from cookies on the server-side.
     * @param {object} context - The context object from getServerSideProps.
     * @returns {object|null} User information or null.
     */
    getUserInfoFromContext(context) {
        if (!context || !context.req || !context.req.headers.cookie) {
            return null;
        }
        try {
            const cookies = parse(context.req.headers.cookie);
            // Ensure you set a cookie named 'userInfo' upon login.
            const userInfoCookie = cookies.userInfo;
            return userInfoCookie ? JSON.parse(userInfoCookie) : null;
        } catch (error) {
            console.error("Failed to parse user info from cookie:", error);
            return null;
        }
    }

    /**
     * Universal way to get user info, works on client and server.
     * @param {object} [context=null] - Optional context from getServerSideProps.
     */
    getUserInfo = (context = null) => {
        return context ? this.getUserInfoFromContext(context) : storageService.getUserInfo();
    }

    /**
     * Prepares default parameters for a request, works on client and server.
     * @param {object} [context=null] - Optional context from getServerSideProps.
     */
    getDefaultParams = (context = null) => {
        const userInfo = this.getUserInfo(context);
        // The user's original code checked for `token`, I'll check for `id` as it's more common.
        if (userInfo && userInfo?.id) {
            return { userId: userInfo.id };
        }
        return { userId: 1 }; // Fallback for guest users
    };

    /**
     * Prepares default headers with Authorization token, works on client and server.
     * @param {object} [context=null] - Optional context from getServerSideProps.
     */
    async getDefaultHeaders(context = null) {
        const defaultHeaders = {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json",
        };
        const userInfo = this.getUserInfo(context);
        if (userInfo && userInfo?.accessToken) {
            defaultHeaders["Authorization"] = `Bearer ${userInfo.accessToken}`;
        }
        return defaultHeaders;
    }

    //
    // --- AUTH (Client-Side Only) ---
    //
    login(data) {
        const requestConfig = {
            url: "/e-commerce/customer/auth/login",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: {
                ...this.getDefaultParams(), // On client, context is null
                email: data?.email,
                password: data?.password,
            },
        };
        return requests.post(requestConfig).then((res) => res).catch((err) => err);
    }

    register(data) {
        const requestConfig = {
            url: "/e-commerce/customer/auth/register",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data
        };
        return requests.post(requestConfig).then((res) => res).catch((err) => err);
    }

    //
    // --- DATA FETCHING (Now Server-Side Compatible) ---
    //

    fetchCategories = (context = null) => {
        const options = {
            url: `/e-commerce/customer/categories`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: this.getDefaultParams(context),
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchSubCategories = (context = null) => {
        const options = {
            url: `/e-commerce/customer/subcategories`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: this.getDefaultParams(context),
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchBrands = (context = null) => {
        const options = {
            url: `/e-commerce/customer/brands`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: this.getDefaultParams(context),
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    getCities = (context = null) => {
        const options = {
            url: `/e-commerce/customer/cities`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchProducts = async (params, context = null) => {
        const options = {
            url: "/e-commerce/customer/products",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: { ...this.getDefaultParams(context), ...params },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };
    
  fetchProductsBySubCategory = async ({ subCategoryId, filter }, context = null) => {
    const options = {
        url: `/e-commerce/customer/products`, // نحذف الـ ID من الراوت
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        params: { 
            sub_category_id: subCategoryId, // هنا نرسل الباراميتر الصح
            ...this.getDefaultParams(context),
            filter
        }
    };
    return requests.get(options)
        .then((response) => response)
        .catch((err) => err);
};


fetchProductsByCategory = async ({ CategoryId, filter, page }, context = null) => { // 🔽 1. إضافة page
    const options = {
        url: `/e-commerce/customer/products`,
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        params: { 
            category_id: CategoryId,
            page: page, // 🔽 2. إضافة page للـ params
            ...this.getDefaultParams(context), 
            filter 
        }
    };
    return requests.get(options).then((response) => response).catch((err) => err);
};


fetchProductsByBrand = async ({ brandId, filter }, context = null) => {
    const options = {
        url: `/e-commerce/customer/products`, // بدون /brand/${brandId}
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        params: { 
            ...this.getDefaultParams(context),
            brand_id: brandId,       // هنا نرسل الـ brandId كـ query parameter
            ...filter
        },
    };
    return requests.get(options).then((response) => response).catch((err) => err);
};


    fetchSingleProduct = async (id, context = null) => {
        if (!id || isNaN(id)) return { error: 'Invalid product ID' };
        const options = {
            url: `/e-commerce/customer/single-products/${id}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: this.getDefaultParams(context),
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchFavorites = async (context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: "/e-commerce/customer/favorites",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };
    
    getFeedbacks = async (productId, context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: `/e-commerce/customer/feedback/products/${productId}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchCart = async (context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchCartCount = async (context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: "/e-commerce/customer/cart/count",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchCountries = (context = null) => {
        const options = {
            url: "/countries",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchSliders = (context = null) => {
        const options = {
            url: `/e-commerce/customer/static`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: this.getDefaultParams(context),
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    getProfile = async (context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: "/e-commerce/customer/profile",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    fetchPaymentMethods = async (context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: "/e-commerce/customer/paymentMethods",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    getAddresses = async (context = null) => {
        const defaultHeaders = await this.getDefaultHeaders(context);
        const options = {
            url: "/e-commerce/customer/addresses",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.get(options).then((response) => response).catch((err) => err);
    };

    // ... The rest of your methods are actions (POST, PATCH, DELETE)
    // and are typically called from the client-side, so they don't need the `context` parameter.
    // They will continue to work as they did before.
    
    removeFromFavorites = async (productId) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const response = await requests.patch({
            url: `/e-commerce/customer/favorites/${productId}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        });
        return response;
    };

    addToFavorites = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            data: data,
            url: "/e-commerce/customer/favorites",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.post(options).then((response) => response).catch((err) => err);
    };

    addFeedback = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            data: data,
            url: "/e-commerce/customer/feedback/products/add",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.post(options).then((response) => response).catch((err) => err);
    };

    addCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: data,
            headers: { ...defaultHeaders },
        };
        return requests.post(options).then((response) => response).catch((err) => err);
    };

    updateCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
            data: data,
        };
        return requests.patch(options).then((response) => response).catch((err) => err);
    };

    updateCartq = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart/update",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
            data: data,
        };
        return requests.patch(options).then((response) => response).catch((err) => err);
    };

    deleteCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
            data: data,
        };
        return requests.delete(options).then((response) => response).catch((err) => err);
    };

    forgotPassword(data) {
        const requestConfig = {
            url: "/e-commerce/customer/auth/forgot-password",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: { email: data?.email, locale: data?.locale },
        };
        return requests.post(requestConfig).then((res) => res).catch((err) => err);
    }

    resetPassword(data) {
        const requestConfig = {
            url: "/e-commerce/customer/auth/reset-password",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: data,
        };
        return requests.post(requestConfig).then((res) => res).catch((err) => err);
    }

    updateProfile = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            data: data,
            url: "/e-commerce/customer/profile",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.patch(options).then((response) => response).catch((err) => err);
    };

    handleCheckout = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/orders/checkout",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
            data,
        };
        return requests.post(options).then((response) => response).catch((err) => err);
    };

    addAddress = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            data,
            url: "/e-commerce/customer/addresses",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.post(options).then((response) => response).catch((err) => err);
    };

    editAddress = async (data, id) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            data,
            url: `/e-commerce/customer/addresses/${id}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.patch(options).then((response) => response).catch((err) => err);
    };

    deleteAddress = async (id) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: `/e-commerce/customer/addresses/${id}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: { ...defaultHeaders },
        };
        return requests.delete(options).then((response) => response).catch((err) => err);
    };
}

const conn = new BackendConnector();
export default conn;
