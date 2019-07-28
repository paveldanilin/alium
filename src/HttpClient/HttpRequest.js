import HttpClient from "./HttpClient.js";

export default class HttpRequest
{
    static get METHOD_GET() {
        return 'GET';
    }

    static get METHOD_POST() {
        return 'POST';
    }

    static get METHOD_DELETE() {
        return 'DELETE';
    }

    static get METHOD_PATCH() {
        return 'PATCH';
    }

    static get METHOD_PUT() {
        return 'PUT';
    }

    static get METHOD_HEAD() {
        return 'HEAD';
    }

    static get METHOD_CONNECT() {
        return 'CONNECT';
    }

    static get METHOD_OPTIONS() {
        return 'OPTIONS';
    }

    static get METHOD_TRACE() {
        return 'TRACE';
    }

    static get MODE_SAME_ORIGIN() {
        return 'same-origin';
    }

    static get MODE_NO_CORS() {
        return 'no-cors';
    }

    static get MODE_CORS() {
        return 'cors';
    }

    static get CREDENTIALS_OMIT() {
        return 'omit';
    }

    static get CREDENTIALS_SAME_ORIGIN() {
        return 'same-origin';
    }

    static get CREDENTIALS_INCLUDE() {
        return 'include';
    }

    static get CACHE_DEFAULT() {
        return 'default';
    }

    static get CACHE_NO_STORE() {
        return 'no-store';
    }

    static get CACHE_RELOAD() {
        return 'reload';
    }

    static get CACHE_NO_CACHE() {
        return 'no-cache';
    }

    static get CACHE_FORECE_CACHE() {
        return 'force-cache';
    }

    static get CACHE_ONLY_IF_CACHED() {
        return 'only-if-cached';
    }

    static get REDIRECT_FOLLOW() {
        return 'follow';
    }

    static get REDIRECT_ERROR() {
        return 'error';
    }

    static fetch(url, options)
    {
        return HttpClient.create().fetch(url, options);
    }

    static post(url, options)
    {
        return HttpClient.create().post(url, options);
    }

    static patch(url, options)
    {
        return HttpClient.create().patch(url, options);
    }

    static delete(url, options)
    {
        return HttpClient.create().delete(url, options);
    }

    static put(url, options)
    {
        return HttpClient.create().put(url, options);
    }

    static filterOptionMethod(method)
    {
        method = method || HttpRequest.METHOD_GET;

        if (typeof method !== 'string') {
            throw new Error('`method` options must me string');
        }

        if (method.trim().length === 0) {
            throw new Error('`method` option must be non empty string');
        }

        method = method.toUpperCase();

        const allowed = [
            HttpRequest.METHOD_GET,
            HttpRequest.METHOD_CONNECT,
            HttpRequest.METHOD_DELETE,
            HttpRequest.METHOD_HEAD,
            HttpRequest.METHOD_OPTIONS,
            HttpRequest.METHOD_PATCH,
            HttpRequest.METHOD_POST,
            HttpRequest.METHOD_PUT,
            HttpRequest.METHOD_TRACE
        ];

        if (! allowed.includes(method)) {
            throw new Error('`method` option value must be on of [' + allowed.join(',') + ']');
        }

        return method;
    }

    static filterOptionMode(mode)
    {
        mode = mode || HttpRequest.MODE_SAME_ORIGIN;

        if (typeof mode !== 'string') {
            throw new Error('`mode` options must me string');
        }

        if (mode.trim().length === 0) {
            throw new Error('`mode` option must be non empty string');
        }

        mode = mode.toLowerCase();

        const allowed = [
            HttpRequest.MODE_SAME_ORIGIN, HttpRequest.MODE_CORS, HttpRequest.MODE_NO_CORS
        ];

        if (! allowed.includes(mode)) {
            throw new Error('`mode` option value must be on of [' + allowed.join(',') + ']');
        }

        return mode;
    }

    static filterOptionCredentials(credentials)
    {
        credentials = credentials || HttpRequest.CREDENTIALS_OMIT;

        if (typeof credentials !== 'string') {
            throw new Error('`credentials` options must me string');
        }

        if (credentials.trim().length === 0) {
            throw new Error('`credentials` option must be non empty string');
        }

        credentials = credentials.toLowerCase();

        const allowed = [
            HttpRequest.CREDENTIALS_OMIT, HttpRequest.CREDENTIALS_INCLUDE, HttpRequest.CREDENTIALS_SAME_ORIGIN
        ];

        if (! allowed.includes(credentials)) {
            throw new Error('`credentials` option value must be on of [' + allowed.join(',') + ']');
        }

        return credentials;
    }

    static filterOptionCache(cache)
    {
        cache = cache || HttpRequest.CACHE_DEFAULT;

        if (typeof cache !== 'string') {
            throw new Error('`cache` options must me string');
        }

        if (cache.trim().length === 0) {
            throw new Error('`cache` option must be non empty string');
        }

        cache = cache.toLowerCase();

        const allowed = [
            HttpRequest.CACHE_DEFAULT,
            HttpRequest.CACHE_FORECE_CACHE,
            HttpRequest.CACHE_NO_CACHE,
            HttpRequest.CACHE_NO_STORE,
            HttpRequest.CACHE_ONLY_IF_CACHED,
            HttpRequest.CACHE_RELOAD
        ];

        if (! allowed.includes(cache)) {
            throw new Error('`cache` option value must be on of [' + allowed.join(',') + ']');
        }

        return cache;
    }

    static filterOptionRedirect(redirect)
    {
        redirect = redirect || HttpRequest.REDIRECT_FOLLOW;

        if (typeof redirect !== 'string') {
            throw new Error('`redirect` options must me string');
        }

        if (redirect.trim().length === 0) {
            throw new Error('`redirect` option must be non empty string');
        }

        redirect = redirect.toLowerCase();

        const allowed = [
            HttpRequest.REDIRECT_FOLLOW,
            HttpRequest.REDIRECT_ERROR
        ];

        if (! allowed.includes(redirect)) {
            throw new Error('`redirect` option value must be on of [' + allowed.join(',') + ']');
        }

        return redirect;
    }
}
