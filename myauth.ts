import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
// IMPORTANT: This library doesn't validate the token, any well-formed JWT can be decoded. You should validate the token in your server-side logic by using something like express-jwt, koa-jwt, Microsoft.AspNetCore.Authentication.JwtBearer, etc.
//
// In order to use jwt-decode in an environment that has no access to atob() (e.g. React Native), ensure to provide the corresponding polyfill in your application by using core-js/stable/atob:

// Ninjw-jwt默认返回的数据
interface NinjaJWTPair {
  email: string;
  refresh: string;
  refresh_exp?: number;
  access: string;
  access_exp?: number;
}

// Ninjw-jwt JWT解码后的数据
interface NinjaJwtPayload {
  // 我的django自定义用户username字段是email，可根据自己情况更改
  email: string;
  user_id: number;
  // NinjaJWT 返回的iat签发和exp过期时间均是UNIX时间戳
  exp: number;
  iat: number;
  token_type: 'access' | 'refresh';
}

// Function to get JWT token from server
export async function getTokenFromServer(
  email: string,
  password: string,
  tokenUrl = 'http://localhost:8000/api/token/pair'
) {
  const start_post_time = new Date().getTime();
  try {
    const response = await fetch(tokenUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // 将对象转换为 JSON 字符串
    });

    // console.log(response);
    if (response.status === 200) {
      const token = (await response.json()) as NinjaJWTPair;
      saveTokenToCookie(token, start_post_time);
    } else {
      throw new Error(`${response.status}: Failed to get token from server`);
    }
  } catch (error) {
    console.error('Error getting token:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

// Function to save JWT token to cookie
export function saveTokenToCookie(token: NinjaJWTPair, start_post_time: number, cookieName = 'jwt_token') {
  try {
    const access = jwtDecode(token.access) as NinjaJwtPayload;
    // 纠正本机和服务端时间偏差，并预留30秒。
    const access_exp = start_post_time - access.iat + access.exp - 30 * 1000;
    const refresh = jwtDecode(token.refresh) as NinjaJwtPayload;
    const refresh_exp = start_post_time - refresh.iat + refresh.exp - 30 * 1000;
    token.access_exp = access_exp;
    token.refresh_exp = refresh_exp;
    console.log(token);

    Cookies.set(cookieName, JSON.stringify(token)); // Store token in cookie named 'jwt_token' and set expiration
    console.log(Cookies.get(cookieName));
  } catch (error) {
    console.error('Error saveTokenToCookie:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

// Function to get JWT token from cookie
export async function getTokenFromCookie(kinds: 'access' | 'refresh', cookieName = 'jwt_token') {
  const x = Cookies.get(cookieName);
  console.log(`in get token from cookie ${x}`);
  if (!x) throw new Error('there is no cookie: ' + cookieName);
  const y: NinjaJWTPair = JSON.parse(x);
  if (!y.access_exp || !y.refresh_exp) {
    throw new Error('error! No exp time.');
  }

  const current_time = new Date().getTime();
  if (kinds === 'access') {
    if (y.access_exp <= current_time) {
      await getRefreshToken();
      await getTokenFromCookie('access');
    } else if (y.access_exp > current_time) {
      return y.access;
    }
  }

  if (kinds == 'refresh') {
    if (y.refresh_exp <= current_time) {
      throw new Error('Error! refresh had exp! Pls relogin');
    }
    return y.refresh;
  }
}

// Function to refresh JWT token
export async function getRefreshToken(
  refreshEndpointUrl = 'http://localhost:8000/api/token/refresh',
  cookieName = 'jwt_token',
) {
  try {
    const currentToken = await getTokenFromCookie('refresh');

    if (!currentToken) {
      throw new Error('No refresh token found in cookie, cannot refresh.');
    }

    const response = await fetch(refreshEndpointUrl, {
      method: 'post',
      body: JSON.stringify({ refresh: currentToken }), // 将对象转换为 JSON 字符串
    });

    if (response.status === 200) {
      const start_post_time = new Date().getTime();
      const newToken = await response.json(); // Assuming the new token is returned in 'newToken' field

      if (!newToken) {
        throw new Error("Error, can't refresh token!");
      }

      saveTokenToCookie(newToken, start_post_time);
      console.log('JWT token refreshed successfully.');
      return newToken;
    } else {
      Cookies.remove(cookieName); // Optionally remove the invalid token cookie
      console.error('Failed to refresh token:', response.status, await response.json());
      return null; // Or handle as needed, e.g., redirect to login
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    Cookies.remove(cookieName); // Optionally remove the invalid token cookie
    return null; // Or handle as needed, e.g., redirect to login
  }
}
