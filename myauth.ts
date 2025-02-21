import axios from 'axios';
import { getRefreshToken } from 'axios-jwt';
import { error } from 'console';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';



// Ninjw-jwt默认返回的数据
interface NinjaJWTPair {
  email: string,
  refresh: string,
  refresh_exp?: number,
  access: string,
  access_exp?: number,
}

// Ninjw-jwt JWT解码后的数据
interface NinjaJwtPayload {
  // 我的django自定义用户username字段是email，可根据自己情况更改
  email: string,
  user_id: number,
  exp: number,
  iat: number,
  token_type: 'access' | 'refresh',
}

// Function to get JWT token from server
async function getTokenFromServer(tokenUrl = 'http://localhost:8000/api/token/pair', email: string, password: string) {
  const start_post_time = new Date().getTime();
  try {
    const response = await axios.post(tokenUrl, {
      email,
      password,
    });

    if (response.status === 200) {
      const token: NinjaJWTPair = response.data;
      saveTokenToCookie(token, start_post_time)
    } else {
      throw new Error(`${response.status}: Failed to get token from server`);
    }
  } catch (error) {
    console.error('Error getting token:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

// Function to save JWT token to cookie
function saveTokenToCookie(token: NinjaJWTPair, start_post_time: number, cookieName = 'jwt_token') {

  const access = jwtDecode<NinjaJwtPayload>(jwtDecode(token.access));
// 纠正本机和服务端时差，并预留30秒。
  const access_exp = start_post_time - access.iat + access.exp - 30 * 1000;
  const refresh = jwtDecode<NinjaJwtPayload>(jwtDecode(token.refresh));
  const refresh_exp = start_post_time - refresh.iat + refresh.exp - 30 * 1000;
  token.access_exp = access_exp;
  token.refresh_exp=refresh_exp;
  Cookies.set(cookieName, JSON.stringify(token)); // Store token in cookie named 'jwt_token' and set expiration
}

// Function to get JWT token from cookie
function getTokenFromCookie(kinds: 'access' | 'refresh', cookieName = 'jwt_token', ) {
  const x = Cookies.get(cookieName);
  if (!x) throw new Error("there is no cookie: " + cookieName);
  const y: NinjaJWTPair = JSON.parse(x);
  if (!y.access_exp || !y.refresh_exp){
    throw new Error("error! No exp time.")
  }

  const current_time = new Date().getTime();
  if (kinds === 'access') {
    if (y.access_exp <= current_time) {
        getRefreshToken();
        getTokenFromCookie('access');
    } else if (y.access_exp > current_time){
    return y.access;
    }
  }

  if (kinds == "refresh") {
    if (y.refresh_exp <= current_time){
      throw new Error("Error! refresh had exp! Pls relogin");
    }
    return y.refresh;
  }
}

// Function to refresh JWT token
function refreshToken(refreshEndpointUrl = 'http://localhost:8000/api/token/refresh', cookieName = 'jwt_token') {
  const currentToken = getTokenFromCookie('refresh');

  if (!currentToken) {
    throw new Error('No refresh token found in cookie, cannot refresh.');
  }

  try {
    const response = await fetch(
      refreshTokenEndpoint,
      {},
      {
        // Send a POST request to refresh token endpoint
        headers: {
          Authorization: `Bearer ${currentToken}`, // Include current token for verification if needed by backend
        },
      },
    );

    if (response.status === 200) {
      const newToken = response.data.newToken; // Assuming the new token is returned in 'newToken' field
      saveTokenToCookie(newToken, cookieName); // Save the new token to the cookie
      console.log('JWT token refreshed successfully.');
      return newToken;
    } else {
      console.error('Failed to refresh token:', response.status, response.data);
      Cookies.remove(cookieName); // Optionally remove the invalid token cookie
      return null; // Or handle as needed, e.g., redirect to login
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    Cookies.remove(cookieName); // Optionally remove the invalid token cookie
    return null; // Or handle as needed, e.g., redirect to login
  }
}

// Function to set up定时刷新token (periodic token refresh)
function setupTokenRefresh(refreshIntervalSeconds = 300) {
  // Refresh every 5 minutes (300 seconds) by default
  setInterval(async () => {
    await refreshToken();
  }, refreshIntervalSeconds * 1000); // setInterval expects milliseconds
}

// // Example usage:

// // 1. Get token after user login
// async function loginUser(username, password) {
//   try {
//     const token = await getTokenFromServer(username, password);
//     saveTokenToCookie(token);
//     console.log('JWT Token saved to cookie after login.');
//     // Redirect user or update UI as needed
//   } catch (loginError) {
//     console.error('Login failed:', loginError);
//     // Handle login error, display message to user
//   }
// }

// // 2. Use token for API requests (example axios interceptor)
// axios.interceptors.request.use(
//   (config) => {
//     const token = getTokenFromCookie();
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`; // Add token to request headers
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // 3. Set up token refresh when app initializes
// setupTokenRefresh();

// // 4. Example of manually refreshing token if needed (e.g., upon 401 error)
// async function handleUnauthorizedError() {
//   const newToken = await refreshToken();
//   if (newToken) {
//     console.log('Successfully refreshed token after 401.');
//     // Retry the original API request (implementation depends on your error handling)
//   } else {
//     console.error('Token refresh failed, redirecting to login.');
//     // Redirect user to login page
//   }
// }
