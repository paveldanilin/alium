import HttpRequest from "./HttpRequest.js";
import HttpError from "./HttpError.js";

export default class HttpClient
{
    constructor(options)
    {
        options = options || {};

        this._baseUrl           = this._filterOptionBaseUrl(options.baseUrl || '');
        this._headers           = options.headers || {};
        this._mode              = options.mode || HttpRequest.MODE_SAME_ORIGIN;
        this._cache             = options.cache || HttpRequest.CACHE_DEFAULT;
        this._redirect          = options.redirect || HttpRequest.REDIRECT_FOLLOW;
        this._credentials       = options.credentials || HttpRequest.CREDENTIALS_SAME_ORIGIN;
        this._throwError        = options.throwError || true;
        this._responseFormat    = this._filterOptionResponseFormat(options.responseFormat || undefined);
    }

    static get RESPONSE_JSON() {
        return 'json';
    }

    static get RESPONSE_TEXT() {
        return 'text';
    }

    static get RESPONSE_FORM_DATA() {
        return 'form-data';
    }

    static get RESPONSE_BLOB() {
        return 'blob';
    }

    static get RESPONSE_ARRAY_BUFFER() {
        return 'array-buffer';
    }

    static get RESPONSE_RAW() {
        return 'raw';
    }

    static create(options)
    {
        return new HttpClient(options);
    }

    fetch(url, options)
    {
        options = options || {};

        return this.sendRequest(
            url,
            HttpRequest.METHOD_GET,
            options.headers || undefined,
            undefined,
            options.mode || undefined,
            options.cache || undefined,
            options.redirect || undefined,
            options.credentials || undefined,
            options.responseFormat || undefined);
    }

    post(url, options)
    {
        options = options || {};

        return this.sendRequest(
            url,
            HttpRequest.METHOD_POST,
            options.headers || undefined,
            options.body || undefined,
            options.mode || undefined,
            options.cache || undefined,
            options.redirect || undefined,
            options.credentials || undefined,
            options.responseFormat || undefined);
    }

    patch(url, options)
    {
        options = options || {};

        return this.sendRequest(
            url,
            HttpRequest.METHOD_PATCH,
            options.headers || undefined,
            options.body || undefined,
            options.mode || undefined,
            options.cache || undefined,
            options.redirect || undefined,
            options.credentials || undefined,
            options.responseFormat || undefined);
    }

    put(url, options)
    {
        options = options || {};

        return this.sendRequest(
            url,
            HttpRequest.METHOD_PUT,
            options.headers || undefined,
            options.body || undefined,
            options.mode || undefined,
            options.cache || undefined,
            options.redirect || undefined,
            options.credentials || undefined,
            options.responseFormat || undefined);
    }

    delete(url, options)
    {
        options = options || {};

        return this.sendRequest(
            url,
            HttpRequest.METHOD_DELETE,
            options.headers || undefined,
            undefined,
            options.mode || undefined,
            options.cache || undefined,
            options.redirect || undefined,
            options.credentials || undefined,
            options.responseFormat || undefined);
    }

    async sendRequest(url, method, headers, body, mode, cache, redirect, credentials, responseFormat)
    {
        headers     = headers || {};
        headers     = Object.assign(this._headers, headers);
        mode        = mode || this._mode;
        cache       = cache || this._cache;
        redirect    = redirect || this._redirect;
        credentials     = credentials || this._credentials;
        responseFormat  = this._filterOptionResponseFormat(responseFormat, this._responseFormat);

        if (this._baseUrl.length > 0) {
            url = this._baseUrl + url;
        }

        const request = new Request(url, {
            method:         HttpRequest.filterOptionMethod(method),
            body:           body,
            headers:        headers,
            mode:           HttpRequest.filterOptionMode(mode),
            cache:          HttpRequest.filterOptionCache(cache),
            redirect:       HttpRequest.filterOptionRedirect(redirect),
            credentials:    HttpRequest.filterOptionCredentials(credentials)
        });

        const response = await fetch(request);

        if (this._throwError && ! response.ok) {
            throw new HttpError(response);
        }

        if (response.ok) {
            switch (responseFormat) {
                case HttpClient.RESPONSE_TEXT:
                    return response.text();

                case HttpClient.RESPONSE_ARRAY_BUFFER:
                    return response.arrayBuffer();

                case HttpClient.RESPONSE_BLOB:
                    return response.blob();

                case HttpClient.RESPONSE_FORM_DATA:
                    return response.formData();

                case HttpClient.RESPONSE_JSON:
                    return response.json();
            }
        }

        return response;
    }

    _filterOptionResponseFormat(responseFormat, defaultFormat)
    {
        responseFormat = responseFormat || defaultFormat || HttpClient.RESPONSE_RAW;

        const allowed = [
            HttpClient.RESPONSE_RAW,
            HttpClient.RESPONSE_JSON,
            HttpClient.RESPONSE_FORM_DATA,
            HttpClient.RESPONSE_BLOB,
            HttpClient.RESPONSE_ARRAY_BUFFER,
            HttpClient.RESPONSE_TEXT
        ];

        responseFormat = responseFormat.toLowerCase();

        if (! allowed.includes(responseFormat)) {
            throw new Error('`responseFormat` option must have value one of [' + allowed.join(',') + ']');
        }

        return responseFormat;
    }

    _filterOptionBaseUrl(baseUrl)
    {
        if (typeof baseUrl !== 'string') {
            throw new Error('`baseUrl` option must be non empty string');
        }

        return baseUrl.trim();
    }
}
