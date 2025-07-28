"use client";
import { createContext, useContext, useEffect, useState } from "react";
import backendConnector from "@/services/connectors/BackendConnector";

const BrandContext = createContext();

export const useBrand = () => useContext(BrandContext);

export const BrandProvider = ({ children }) => {
    const [brandColors, setBrandColors] = useState({
        primaryColor: "#9306FF",
        secondaryColor: "#000000",
    });

    const fetchBrand = async () => {
        try {
            const data = await backendConnector.fetchBrandLogo();
            if (data?.primaryColor && data?.secondaryColor) {
                setBrandColors({
                    primaryColor: data.primaryColor,
                    secondaryColor: data.secondaryColor,
                });
            }
        } catch (error) {
            console.error("Failed to fetch brand colors", error);
        }
    };

    useEffect(() => {
        fetchBrand();
    }, []);

    return (
        <BrandContext.Provider value={{ brandColors, setBrandColors }}>
            {children}
        </BrandContext.Provider>
    );
};
