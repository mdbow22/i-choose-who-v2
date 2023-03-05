import { env } from '@/env.mjs';
import axios, { AxiosInstance } from 'axios';
import React, { createContext, useContext, useState } from 'react'

export const API = createContext<{ api: AxiosInstance } | null >(null);
export const useAPI = () => useContext(API)!.api;

export const APIProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

    const [api] = useState<AxiosInstance>(() => axios.create({
        baseURL: env.NEXT_PUBLIC_API_URL,
        timeout: 15000,
    }))

  return (
    <>
        <API.Provider value={{ api }}>
            { children }
        </API.Provider>
    </>
  )
}

