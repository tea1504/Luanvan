export class IResult {
  /**
   * @param {any} response
   * @param {any} data
   */
  constructor(response, data) {
    this.response = response
    this.data = data
  }
}

export class IError {
  /**
   * @param {string} code
   * @param {string | undefined} message
   * @param {any} extras
   */
  constructor(code, message, extras) {
    this.code = code
    this.message = message === undefined ? null : message
    this.extras = extras === undefined ? null : extras
  }
}
