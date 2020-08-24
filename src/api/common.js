import { $http } from '@/utils/http.js'

/**
 * test - get
 *
 * @param {*} data
 */
export const TestGetApi = data => $http.get('getUrl', data)

/**
 * test - post
 *
 * @param {*} data
 */
export const TestPostApi = data => $http.post('postUrl', data)
