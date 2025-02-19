// api.ts

import {
  IAuthTokens,
  TokenRefreshRequest,
  applyAuthTokenInterceptor,
  getBrowserLocalStorage,
} from 'axios-jwt';
import axios from 'axios';
import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'axios-jwt'

const BASE_URL = 'http://localhost:8000';
const REFRESH_URL = '/api/token/refresh';
const TOKEN_PAIR_URL = '/api/token/pair';

// 1. Create an axios instance that you wish to apply the interceptor to
export const axiosInstance = axios.create({ baseURL: BASE_URL });

// 2. Define token refresh function.
export const requestRefresh: TokenRefreshRequest = async (
  refreshToken: string,
): Promise<IAuthTokens | string> => {
  // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor (in our case 'axiosInstance')
  // because this will result in an infinite loop when trying to refresh the token.
  // Use the global axios client or a different instance
  const response = await axios.post(`${BASE_URL}/${REFRESH_URL}`, { token: refreshToken });

  // If your backend supports rotating refresh tokens, you may also choose to return an object containing both tokens:
  // return {
  //  accessToken: response.data.access,
  //  refreshToken: response.data.refresh
  //}

  return response.data.access;
};

// 3. Add interceptor to your axios instance
applyAuthTokenInterceptor(axiosInstance, { requestRefresh })

// // New to 2.2.0+: initialize with storage: localStorage/sessionStorage/nativeStorage. Helpers: getBrowserLocalStorage, getBrowserSessionStorage
// const getStorage = getBrowserLocalStorage

// // You can create you own storage, it has to comply with type StorageType
// applyAuthTokenInterceptor(axiosInstance, { requestRefresh, getStorage })


// 4. Post email and password and get tokens in return. Call setAuthTokens with the result.
interface ILoginRequest {
  email: string,
  password: string,
}

import {
  getAccessToken,
  applyAuthTokenInterceptor,
  getRefreshToken,
  getBrowserLocalStorage,
} from 'axios-jwt';
import { login, axiosInstance, requestRefresh } from './api';
export const login = async (params: ILoginRequest) => {

  applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,  // async function that takes a refreshToken and returns a promise the resolves in a fresh accessToken
  })
  const response = await axiosInstance.post(TOKEN_PAIR_URL, params)

  console.log(response.data.access)
  console.log(response.data.refresh)
  // save tokens to storage
  await setAuthTokens({
    accessToken: response.data.access,
    refreshToken: response.data.refresh
  })
}

// 5. Remove the auth tokens from storage
export const logout = async () => await clearAuthTokens()


  applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,  // async function that takes a refreshToken and returns a promise the resolves in a fresh accessToken
    tokenExpireFudge: 10,
    getStorage:getBrowserLocalStorage
  })
  await login({ email: '25931014@qq.com', password: 'whopawho' });

  const accessToken = await getAccessToken();
  console.log(accessToken);

  const refreshToken= await getRefreshToken();
  console.log(refreshToken);
