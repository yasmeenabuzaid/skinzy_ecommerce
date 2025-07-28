"use client";
import React, { useContext, useState, useEffect } from "react";
// Services
import BackendConnector from "@/services/connectors/BackendConnector";
import storageService from "@/services/storage/storageService";
//
const FavoritesContext = React.createContext({});

export const FavoritesContextProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    // FUNCTION TO FETCH FAVORITES
    const fetchFavorites = async () => {
        try {
            const userInfo = storageService.getUserInfo();
            if (!userInfo || !userInfo?.accessToken) return null;
            setIsFetching(true);
            const data = await BackendConnector.fetchFavorites();
            setIsFetching(false);
            if (data.succuss) {
                setFavorites(data.favorites);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // FUNCTION TO DELETE FAVORITE
    const addFavorite = async (productId) => {
        try {
            const data = await BackendConnector.addFavorite({ productId });
            if (data.succuss) {
                fetchFavorites();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // FUNCTION TO DELETE FAVORITE
    const deleteFavorite = async (productId) => {
        try {
            const data = await BackendConnector.deleteFavorite({ productId });
            if (data.succuss) {
                fetchFavorites();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            setIsFetching(false);
            console.log(error);
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                addFavorite,
                deleteFavorite,
                favorites,
                isFetching,
                fetchFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    return context;
};
