import Constants from 'src/constants'
import BaseService from './base.service'

class UserService extends BaseService {
  /**
   * @param {String} userName
   * @param {String} userPassword
   */
  async login(userName, userPassword) {
    const result = await this.api.post({
      path: Constants.ApiPath.LOGIN,
      data: { userName, userPassword },
    })
    return result
  }
  async getInfo() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_USER,
    })
    return result
  }
}

export default UserService
