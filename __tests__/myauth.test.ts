/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {getTokenFromServer, getTokenFromCookie, getRefreshToken } from '../myauth';

describe('myauth module', () => {
  test('login token', async () => {
    await getTokenFromServer("25931014@qq.com", "whopawho");
    await getTokenFromCookie("access");
    await getTokenFromCookie("refresh");
    await getRefreshToken();
  });
});
