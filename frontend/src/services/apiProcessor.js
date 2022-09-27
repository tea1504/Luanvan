import axios from 'axios'
import Constants from 'src/constants'
import Helpers from 'src/commons/helpers'
const __DEV__ = process.env.NODE_ENV !== 'production'

/**
 * Enum for method
 */
export const Method = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

/**
 * Enum for content type
 */
export const ContentType = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  FORM_DATA: 'multipart/form-data',
}

class ApiProcessor {
  static instance = new ApiProcessor()
  constructor() {
    this.config = {
      baseURL: Constants.Api.BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': ContentType.JSON,
      },
      method: Method.GET,
      timeout: Constants.Api.TIMEOUT,
      // onDownloadProgress: (progressEvent) => {
      //   console.log(progressEvent.currentTarget.response)
      // },
    }
    this.httpClient = axios.create(this.config)
  }

  /**
   * Update config to common config of http client.
   *
   * @param {import("./../commons/interfaces").IConfiguration} config config New config
   * @param {boolean} forceUpdate forceUpdate Merge new config to common config if false, override if otherwise, default is false.
   */
  static updateCommonConfig(config, forceUpdate = false) {
    if (forceUpdate === true) {
      ApiProcessor.instance.config = config
    } else {
      ApiProcessor.instance.config = {
        ...ApiProcessor.instance.config,
        ...config,
      }
    }
  }

  /**
   * Call api with POST method, using to upload file to server.
   *
   * @param {import("./../commons/interfaces").IRequest} request
   * @return {Promise<import("./../commons/interfaces").IResult>}
   */
  static postFormData(request) {
    request.method = Method.POST
    request.contentType = ContentType.FORM_DATA
    return new Promise((resolve, reject) => {
      request.onSuccess = (result) => {
        resolve(result)
      }
      request.onError = (error) => {
        reject(error)
      }
      ApiProcessor.instance.fetch(request)
    })
  }

  /**
   * Call api with PATCH method.
   *
   * @param {import("./../commons/interfaces").IRequest} request
   * @return {Promise<import("./../commons/interfaces").IResult>}
   */
  static path(request) {
    request.method = Method.PATCH
    return new Promise((resolve, reject) => {
      request.onSuccess = (result) => {
        resolve(result)
      }
      request.onError = (error) => {
        reject(error)
      }
      ApiProcessor.instance.fetch(request)
    })
  }

  /**
   * Call api with POST method.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request
   * @return {Promise<import("./../commons/interfaces").IResult>}
   */
  static post(request) {
    request.method = Method.POST
    return new Promise((resolve, reject) => {
      request.onSuccess = (result) => {
        resolve(result)
      }
      request.onError = (error) => {
        reject(error)
      }
      ApiProcessor.instance.fetch(request)
    })
  }

  /**
   * Call api with GET method.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request
   * @return {Promise<import("./../commons/interfaces").IResult>}
   */
  static get(request) {
    request.method = Method.GET
    if (request.config) ApiProcessor.updateCommonConfig(request.config)
    else {
      delete ApiProcessor.instance.config.onDownloadProgress
    }
    console.log(request.config);
    return new Promise((resolve, reject) => {
      request.onSuccess = (result) => {
        resolve(result)
      }
      request.onError = (error) => {
        reject(error)
      }
      ApiProcessor.instance.fetch(request)
    })
  }

  /**
   * Call api with PUT method.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request
   * @return {Promise<import("./../commons/interfaces").IResult>}
   */
  static put(request) {
    request.method = Method.PUT
    return new Promise((resolve, reject) => {
      request.onSuccess = (result) => {
        resolve(result)
      }
      request.onError = (error) => {
        reject(error)
      }
      ApiProcessor.instance.fetch(request)
    })
  }

  /**
   * Call api with DELETE method.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request
   * @return {Promise<import("./../commons/interfaces").IResult>}
   */
  static delete(request) {
    request.method = Method.DELETE
    return new Promise((resolve, reject) => {
      request.onSuccess = (result) => {
        resolve(result)
      }
      request.onError = (error) => {
        reject(error)
      }
      ApiProcessor.instance.fetch(request)
    })
  }

  /**
   * Main function fetching data from server.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request.
   */
  async fetch(request) {
    this.onBeforeCallback(request)

    // create config for each request
    const axiosConfig = await this.createAxiosConfig(request)
    if (__DEV__) {
      const { method, path, requestId } = request
      console.log(
        `%c ${requestId} - #fetch [${method}: ${path}] `,
        Constants.Styles.CONSOLE_LOG_START,
      )
      console.log('  > config :', axiosConfig)
    }

    // request to server
    this.httpClient
      .request(axiosConfig)
      .then((response) => {
        this.onAfterCallback(request, response)
        this.onSuccessCallback(request, response)
      })
      .catch((error) => {
        const response = error ? error.response : null
        this.onAfterCallback(request, response, error)
        this.onErrorCallback(request, response, error)
      })
  }

  /**
   * Create config for each request.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request.
   */
  async createAxiosConfig(request) {
    const axiosConfig = {
      ...this.config,
      method: request.method,
      url: request.path,
    }
    // timeout
    if (Helpers.isNumber(request.timeout)) {
      axiosConfig.timeout = request.timeout
    }
    // query string
    // TODO: temporarily set locale to vn
    // axiosConfig.params = { ...axiosConfig.params, locale: "vn" };
    if (!Helpers.isNullOrEmpty(request.query)) {
      axiosConfig.params = { ...axiosConfig.params, ...request.query }
    }
    // data (IMPORTANT: not set data if method is GET)
    if (axiosConfig.method !== Method.GET) {
      axiosConfig.data = { ...axiosConfig.data, ...request.data }
      // authentication
      if (request.secure !== false) {
        // Add logic for authentication
        // add new secure to header or data or query string
      }
    }
    // headers
    if (!Helpers.isNullOrEmpty(request.contentType)) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Content-Type': request.contentType,
      }
    }

    const accessToken = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)
    if (accessToken) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'X-API-key': `Bearer ${accessToken}`,
      }
    }

    if (!Helpers.isNullOrEmpty(request.headers)) {
      axiosConfig.headers = { ...axiosConfig.headers, ...request.headers }
    }
    return axiosConfig
  }

  /**
   * Function execute before request to server.
   * Create request id and clientStartTime, using for monitoring and calculate request duration.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request.
   */
  onBeforeCallback(request) {
    request.clientStartTime = Date.now()
    request.requestId = request.clientStartTime
  }

  /**
   * Function execute after received from server.
   *
   * @param {import("./../commons/interfaces").IRequest} request Request.
   * @param {import("./../commons/interfaces").IResponse} response Response
   * @param {any} error Error if has error, default is null
   */
  onAfterCallback = (request, response, error = null) => {
    request.clientEndTime = Date.now()
  }

  /**
   * Execute after end request if success
   *
   * @param {import("./../commons/interfaces").IRequest} request Request.
   * @param {import("./../commons/interfaces").IResponse} response Response
   */
  onSuccessCallback = (request, response) => {
    const data = response.data
    if (Helpers.isFunction(request.onSuccess)) {
      request.onSuccess({ data, response })
    }
  }

  /**
   * Execute after end request if error
   *
   * @param {import("./../commons/interfaces").IRequest} request Request.
   * @param {import("./../commons/interfaces").IResponse} response Response
   * @param {any} error Error
   */
  onErrorCallback = async (request, response, error) => {
    if (__DEV__) {
      const { method, path, requestId } = request
      console.log(
        `%c ${requestId} - #onErrorCallback [${method}: ${path}] `,
        Constants.Styles.CONSOLE_LOG_ERROR,
      )
      console.log('  > request  :', request)
      console.log('  > response :', response)
      console.log('  > error    :', error)
    }

    // Error handler
    if (error) {
      // TODO: show token expired
      if (response) {
        // Log error to debug console
        if (response.data && response.data.error_description) {
          if (__DEV__) {
            console.warn(`#onErrorCallback: ${response.data.error_description}`)
          }
        }

        // Error server
        if (!Helpers.isNullOrEmpty(response.status)) {
          if (__DEV__) {
            console.warn('#onErrorCallback: Error server')
          }
          if (Helpers.isFunction(request.onError)) {
            const message = response.data?.message
            request.onError({
              code: response.status || Constants.ApiCode.INTERNAL_SERVER,
              message: message,
            })
          }
          return
        }
      }
    }
  }
}

export default ApiProcessor
