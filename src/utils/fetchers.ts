import { BaseRequest, HttpMethod, method, setUrl } from 'datx-network';
import { User } from '../models/User';

const base = new BaseRequest('http://localhost:8080');

/**
 * Register an user
 * Params: null
 * Body: { email: string; password: string }
 */
export const register = base.pipe<User, null>(setUrl('/auth/register', User), method(HttpMethod.Post));

/**
 * Login an user
 * Params: null
 * Body: { email: string; password: string }
 */
export const login = base.pipe<User, null>(setUrl('/auth/login', User), method(HttpMethod.Post));

/**
 * Logout an user
 * Params: null
 * Body: null
 */
export const logout = base.pipe<null, null>(setUrl('/auth/logout'), method(HttpMethod.Post));

/**
 * Get the current user
 * Params: { relations: Array<string>}
 * Body: null
 */
type IRelations = 'todoLists' | 'todoLists.todos' | 'demographicProfile' | 'newsletterPreferences';
export const getCurrentUser = base.pipe<User, { relations: Array<IRelations> }>(setUrl('/auth/user', User));
