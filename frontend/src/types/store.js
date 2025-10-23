import { User } from "./user";
/**
 * @typedef {Object} AuthState
 * @property {string|null} accessToken
 * @property {User|null} user
 * @property {boolean} loading
 * @property {function(): void} clearState
 * @property {function(string): void} setAccessToken
 * @property {function(string, string): Promise<void>} signIn
 * @property {function(): Promise<void>} signOut
 * @property {function(string, string, string, string, string): Promise<void>} signUp
 * @property {function(): Promise<void>} fetchMe
 * @property {function(): Promise<void>} refresh
 */
export const AuthState = {};