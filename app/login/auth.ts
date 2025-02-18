import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface NinjaJwtPayload {
  // 我的django自定义用户username字段是email，可根据自己情况更改
  email: string;
  user_id: number;
  exp: number;
  iat: number;
  token_type: 'access' | 'refresh';
}

interface CombineJWTtoken {
  server_client_timedelta: number;
  // 整合access token和refresh token
  access: NinjaJwtPayload;
  refresh: NinjaJwtPayload;
}

// Function to get JWT token from server
async function getTokenFromServer(username: string, password: string): Promise<CombineJWTtoken> {
  const client_time = new Date().getTime();
  try {
    const response = await axios.post('/api/login', {
      // Replace '/api/login' with your actual login endpoint
      username: username,
      password: password,
    });

    if (response.status === 200) {
      const token = response.data.token; // Assuming the token is returned in the 'token' field of the response data
      const access = jwtDecode<NinjaJwtPayload>(jwtDecode(token.access));
      const refresh = jwtDecode<NinjaJwtPayload>(jwtDecode(token.refresh));
      const tokenDecode: CombineJWTtoken = {
        server_client_timedelta: access.iat - client_time,
        access: { ...access },
        refresh: { ...refresh },
      };
      return tokenDecode;
    } else {
      throw new Error('Failed to get token from server');
    }
  } catch (error) {
    console.error('Error getting token:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

// Function to save JWT token to cookie
function saveTokenToCookie(token: CombineJWTtoken, cookieName = 'jwt_token') {
  const expirationDays = (token.refresh.exp - token.refresh.iat) / 24 / 60 / 60 - 1;
  Cookies.set(cookieName, JSON.stringify(token), { expires: expirationDays }); // Store token in cookie named 'jwt_token' and set expiration
}

// Function to get JWT token from cookie
function getTokenFromCookie(cookieName = 'jwt_token') {
  return Cookies.get(cookieName);
}

// Function to refresh JWT token
async function refreshToken(refreshTokenEndpoint = '/api/refresh-token', cookieName = 'jwt_token') {
  // Replace '/api/refresh-token' with your refresh token endpoint
  const currentToken = getTokenFromCookie(cookieName);

  if (!currentToken) {
    console.warn('No JWT token found in cookie, cannot refresh.');
    return null; // Or handle as needed, e.g., redirect to login
  }

  try {
    const response = await axios.post(
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

// Example usage:

// 1. Get token after user login
async function loginUser(username, password) {
  try {
    const token = await getTokenFromServer(username, password);
    saveTokenToCookie(token);
    console.log('JWT Token saved to cookie after login.');
    // Redirect user or update UI as needed
  } catch (loginError) {
    console.error('Login failed:', loginError);
    // Handle login error, display message to user
  }
}

// 2. Use token for API requests (example axios interceptor)
axios.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Set up token refresh when app initializes
setupTokenRefresh();

// 4. Example of manually refreshing token if needed (e.g., upon 401 error)
async function handleUnauthorizedError() {
  const newToken = await refreshToken();
  if (newToken) {
    console.log('Successfully refreshed token after 401.');
    // Retry the original API request (implementation depends on your error handling)
  } else {
    console.error('Token refresh failed, redirecting to login.');
    // Redirect user to login page
  }
}
