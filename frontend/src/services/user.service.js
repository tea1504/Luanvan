import Constants from 'src/constants'
import BaseService from './base.service'

class UserService extends BaseService {
  /**
   * @param {String} userName
   * @param {String} userPassword
   * @returns {Promise<import("./../commons/interfaces").IResult>}
   */
  async login(userName, userPassword) {
    const result = await this.api.post({
      path: Constants.ApiPath.LOGIN,
      data: { userName, userPassword },
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
  /**
   * @returns {Promise<import("./../commons/interfaces").IResult>}
   */
  async putInfo(data) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.PUT_USER,
      data: data,
    })
    return result
  }
  /**
   * @returns {Promise<import("./../commons/interfaces").IResult>}
   */
  async changePassword(data) {
    const result = await this.api.put({
      path: Constants.ApiPath.CHANGE_PASSWORD,
      data: data,
    })
    return result
  }
}

export default UserService
