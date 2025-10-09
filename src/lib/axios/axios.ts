import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/lib/zustand/use-auth-store'
import type { RefreshTokenResponse } from '@/@types/auth.type'


const BASE_URL = import.meta.env.VITE_API_URL as string


export const api = axios.create({
baseURL: BASE_URL,
headers: { 'Content-Type': 'application/json' }
})


// --- Attach Authorization header if token exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
const token = useAuthStore.getState().accessToken
if (token) {
config.headers = config.headers || {}
config.headers.Authorization = `Bearer ${token}`
}
return config
})


// --- Refresh token on 401
let isRefreshing = false
let pendingQueue: Array<(token: string) => void> = []


async function doRefreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
const res = await axios.post(`${BASE_URL}/api/Auth/refresh-token`, { refreshToken })
// BE có thể bọc data hoặc trả thẳng; lấy trường hợp phổ biến nhất trước
return res.data?.data ?? res.data
}


api.interceptors.response.use(
(res) => res,
async (error: AxiosError) => {
const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }


if (error.response?.status === 401 && !original._retry) {
original._retry = true
const store = useAuthStore.getState()


if (!store.refreshToken) {
// không có RT → clear luôn
useAuthStore.getState().clear()
return Promise.reject(error)
}


// tránh gọi refresh song song
if (isRefreshing) {
return new Promise((resolve) => {
pendingQueue.push((newToken: string) => {
original.headers = original.headers || {}
original.headers.Authorization = `Bearer ${newToken}`
resolve(api(original))
})
})
}


try {
isRefreshing = true
const { accessToken, refreshToken } = await doRefreshToken(store.refreshToken)
useAuthStore.getState().save({ accessToken, refreshToken: refreshToken || store.refreshToken })


// replay queue
pendingQueue.forEach((cb) => cb(accessToken))
pendingQueue = []


original.headers = original.headers || {}
original.headers.Authorization = `Bearer ${accessToken}`
return api(original)
} catch (e) {
useAuthStore.getState().clear()
return Promise.reject(e)
} finally {
isRefreshing = false
}
}


return Promise.reject(error)
}
)