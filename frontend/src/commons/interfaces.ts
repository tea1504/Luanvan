export interface IResult {
  response: any;
  data: {
    data: any,
    response: any,
  };
}

export interface IError {
  code: string;
  message?: string;
  extras?: any;
}

/**
 * Interface for configuration for Axios library
 */
export interface IConfiguration {
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  baseURL?: string,

  // `url` is the server URL that will be used for the request
  url?: string,

  // `method` is the request method to be used when making the request
  method?: Method,

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout?: number, // default is `0` (no timeout)
  // `headers` are custom headers to be sent
  headers?: any,

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params?: any,

  // `data` is the data to be sent as the request body
  // Only applicable for request methods "PUT", "POST", and "PATCH"
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  data?: any
}

/**
* Interface for response schema of Axios library
*/
export interface IResponse {
  // `data` is the response that was provided by the server
  data?: any,

  // `status` is the HTTP status code from the server response
  status?: number,

  // `statusText` is the HTTP status message from the server response
  statusText?: string,

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers?: any,

  // `config` is the config that was provided to `axios` for the request
  config?: any,

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request?: any
}

/**
* Interface of Request
*/
export interface IRequest {
  requestId?: number,
  clientStartTime?: number,
  clientEndTime?: number,
  path: string,
  method?: Method,
  query?: any,
  data?: any,
  secure?: boolean,
  timeout?: number,
  headers?: any,
  contentType?: ContentType,
  onSuccess?: (result: IResult) => void,
  onError?: (error: IError) => void
}

/**
* Enum for method
*/
export enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
* Enum for content type
*/
export enum ContentType {
  JSON = "application/json",
  FORM = "application/x-www-form-urlencoded",
  FORM_DATA = "multipart/form-data",
}