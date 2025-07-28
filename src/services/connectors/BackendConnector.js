import axios from "axios";
// Config
import storageService from "../storage/storageService";
import requests from "./Request";

class BackendConnector {
    //
    // Shared
    //
    constructor() {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Origin: "https://api.atech-workspace.com",
        };
    }

    getDefaultParams = () => {
        const userInfo = storageService.getUserInfo();
        if (userInfo && userInfo?.token) {
            return { userId: userInfo?.id };
        }
        return { userId: 1 };
    };

    async getDefaultHeaders() {
        const defaultHeaders = {
            accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
        };
        const userInfo = storageService?.getUserInfo();
        console.log(userInfo);
        if (userInfo && userInfo?.accessToken) {
            defaultHeaders["Authorization"] = `Bearer ${userInfo?.accessToken}`;
        }
        return defaultHeaders;
    }
    //
    // AUTH
    //

    login(data) {
        const defaultParams = this.getDefaultParams();
        const requestConfig = {
            url: "/e-commerce/customer/auth/login",
            // baseURL: globalConfig.BACKEND_APIS_BASE_URL,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: {
                ...defaultParams,
                email: data?.email,
                password: data?.password,
            },
        };
        return requests
            .post(requestConfig)
            .then((res) => res)
            .catch((err) => {
                console.log("login backend connector error: ", err);
                return err;
            });
    }

   register(data) {
    const defaultParams = this.getDefaultParams();
    const requestConfig = {
        url: "/e-commerce/customer/auth/register",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,

        data
    };

    return requests
        .post(requestConfig)
        .then((res) => res)
        .catch((err) => {
            console.log("register backend connector error: ", err);
            return err;
        });
}


    // CATEGORIES

    fetchCategories = () => {
        const defaultParams = this.getDefaultParams();

        const options = {
            url: `/e-commerce/customer/categories`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: {
                ...defaultParams,
            },
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    fetchSubCategories = () => {
        const defaultParams = this.getDefaultParams();

        const options = {
            url: `/e-commerce/customer/subcategories`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: {
                ...defaultParams,
            },
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    fetchBrands = () => {
        const defaultParams = this.getDefaultParams();

        const options = {
            url: `/e-commerce/customer/brands`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: {
                ...defaultParams,
            },
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };

    getCities = () => {

        const options = {
            url: `/e-commerce/customer/cities`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
          
        };

        return requests
            .get(options)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                console.error("Error fetching brand logo:", err);
                return err;
            });
    };

    // Products

    fetchProducts = async (params) => {
        const defaultParams = this.getDefaultParams();

        let options = {
            url: "/e-commerce/customer/products",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: {
                ...defaultParams,
                ...params,
            },
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };





    
   fetchProductsBySubCategory = async ({ subCategoryId, filter }) => {

   
    if (filter) {
        params.filter = filter;
    }

    const options = {
        url: `/e-commerce/customer/products/${subCategoryId}`, 
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    };

    return requests
        .get(options)
        .then((response) => response)
        .catch((err) => err);
};
fetchProductsByBrand = async ({ brandId, brandSlug, filter }) => {
  const options = {
    url: `/e-commerce/customer/products/brand/${brandId}`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    params: filter, 
  };

  return requests
    .get(options)
    .then((response) => {
      const data = response?.data ?? response;
      return data;
    })
    .catch((err) => {
      console.error("❌ API error:", err);
      return [];
    });
};




    


   fetchSingleProduct = async (id) => {
    if (!id || isNaN(id)) {
        return { error: 'Invalid product ID' };
    }

    const defaultParams = this.getDefaultParams();

    let options = {
        url: `/e-commerce/customer/single-products/${id}`,
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        params: {
            ...defaultParams,
        },
    };

    return requests
        .get(options)
        .then((response) => response)
        .catch((err) => {
            console.error('Fetch product error:', err);
            return { error: 'Failed to fetch product' };
        });
};

    // Favorites
    fetchFavorites = async () => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            url: "/e-commerce/customer/favorites",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };

    deleteFavorite = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            data: data,
            url: "/e-commerce/customer/favorites",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .delete(options)
            .then((response) => response)
            .catch((err) => err);
    };

    addFavorite = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            data: data,
            url: "/e-commerce/customer/favorites",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => err);
    };
    addFeedback = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            data: data,
            url: "/e-commerce/customer/feedback/products/add",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => err);
    };
    getFeedbacks = async (productId) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            url: `/e-commerce/customer/feedback/products/${productId}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };

    // CART
    fetchCart = async () => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };

        console.log(options);

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    addCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
      const options = {
  url: "/e-commerce/customer/cart",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  data: data,         
  headers: {
    ...defaultHeaders,
  },
};


        return requests
            .post(options)

            
            .then((response) => response)
            .catch((err) => err);
    };

    updateCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
            data: data,
        };

        return requests
            .patch(options)
            .then((response) => response)
            .catch((err) => err);
    };
    updateCartq = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart/update",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
            data: data,
        };

        return requests
            .patch(options)
            .then((response) => response)
            .catch((err) => err);
    };
    deleteCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/cart",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
            data: data,
        };

        return requests
            .delete(options)
            .then((response) => response)
            .catch((err) => err);
    };

    forgetPassword = (data) => {
        const options = {
            url: "/e-commerce/customer/auth/forget-password",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: {
                userId: 3,
                email: data?.email,
            },
        };
        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => err);
    };

    changePassword = (data) => {
        const options = {
            url: "/e-commerce/customer/auth/change-password",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: {
                userId: 3,
                resetToken: data?.resetToken,
                newPassword: data?.newPassword,
            },
        };

        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => err);
    };

    addToCart = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/carts/",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            data: {
                userId: 1,
                productId: data?.productId,
                quantity: data?.quantity,
                name: data?.name,
                price: data?.price,
            },
            headers: {
                ...defaultHeaders,
            },
        };

        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => err);
    };

    fetchCountries = () => {
        const options = {
            url: "/countries",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    fetchSliders = () => {
        const defaultParams = this.getDefaultParams();

        const options = {
            url: `/e-commerce/customer/static`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            params: {
                ...defaultParams,
            },
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    getProfile = async () => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            url: "/e-commerce/customer/profile",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };

        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    updateProfile = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const options = {
            data: data,
            url: "/e-commerce/customer/profile",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };

        return requests
            .patch(options)
            .then((response) => response)
            .catch((err) => err);
    };

    handleCheckout = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        const customerInfo = localStorage.getItem("customerInfo");
        const accessToken = customerInfo
            ? JSON.parse(customerInfo)?.accessToken
            : null;
        if (!accessToken) {
            return Promise.reject(
                new Error("Access token is missing or invalid")
            );
        }

        let options = {
            url: "/e-commerce/customer/orders/checkout",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            data,
        };

        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => {
                console.error("Error during checkout:", err);
                return Promise.reject(err);
            });
    };

    // Payment Methods
    fetchPaymentMethods = async () => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            url: "/e-commerce/customer/paymentMethods",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
 
    // Addresses
    getAddresses = async () => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            url: "/e-commerce/customer/addresses",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .get(options)
            .then((response) => response)
            .catch((err) => err);
    };
    addAddress = async (data) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            data,
            url: "/e-commerce/customer/addresses",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .post(options)
            .then((response) => response)
            .catch((err) => err);
    };
    editAddress = async (data, id) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            data,
            url: `/e-commerce/customer/addresses/${id}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
        };
        return requests
            .patch(options)
            .then((response) => response)
            .catch((err) => err);
    };
    deleteAddress = async (id) => {
        const defaultHeaders = await this.getDefaultHeaders();
        let options = {
            url:`/e-commerce/customer/addresses/${id}`,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                ...defaultHeaders,
            },
          
        };
        return requests
            .delete(options)
            .then((response) => response)
            .catch((err) => err);
    };
    
   
}

let conn = new BackendConnector();
export default conn;
