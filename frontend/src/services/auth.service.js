import Constants from 'src/constants'
import BaseService from './base.service'

class AuthService extends BaseService {
  /**
   *
   * @param {string} code
   * @param {string} password
   * @returns {Promise<import("./../commons/interfaces").IResult>}
   */
  async login(code, password) {
    const result = await this.api.post({
      path: Constants.ApiPath.LOGIN,
      data: { code, password },
    })
    return result
  }
  /**
   * @returns {Promise<import("./../commons/interfaces").IResult>}
   */
  async getInfo() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_USER,
    })
    return result
  }
}

export default AuthService
