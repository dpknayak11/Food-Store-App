// SPAcall.js

import axios from 'axios';
import { BASE_URL } from './config';
import { authHeader } from './auth';

// Axios config
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        ...authHeader()
    }
};

// Handle success response
const handleResponse = (result) => {
    return {
        success: true,
        status: result.status,
        ...result.data
    };
};

// Main HTTP request function
const makeHttpRequest = async (method, url, params) => {
    try {
        const result = await axios({
            method,
            url: BASE_URL + url,
            data: method !== 'GET' && method !== 'DELETE' ? { ...params } : undefined,
            params: method === 'GET' ? { ...params } : undefined,
            ...axiosConfig
        });

        // console.log("API Success:", result);
        return handleResponse(result);

    } catch (error) {
        console.log("API Error:", error);

        if (error.response) {
            return {
                success: false,
                status: error.response.status,
                ...error.response.data
            };

        } else if (error.request) {
            return {
                success: false,
                status: 0,
                message: 'Network error'
            };

        } else {
            return {
                success: false,
                message: error.message
            };
        }
    }
};

// Handle invalid token case
const invalidToken = () => {
    sessionStorage.clear();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

// GET request
const httpGet = async (url, params = {}) =>
    await makeHttpRequest('GET', url, params);

// POST request
const httpPost = async (url, params = {}) =>
    await makeHttpRequest('POST', url, params);

// PUT request
const httpPut = async (url, params = {}) =>
    await makeHttpRequest('PUT', url, params);

// DELETE request
const httpDelete = async (url, params = {}) =>
    await makeHttpRequest('DELETE', url, params);

export { authHeader, httpGet, httpPost, httpPut, httpDelete };
