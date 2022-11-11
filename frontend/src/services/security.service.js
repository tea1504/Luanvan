import Constants from 'src/constants'
import BaseService from './base.service'

class SecurityService extends BaseService {
  async getList() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_LIST_SECURITIES,
    })
    return result
  }
  async getMany(limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_SECURITIES(limit, pageNumber, filter),
    })
    return result
  }
  async getOne(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_SECURITY(id),
    })
    return result
  }
  async createOne(type) {
    const result = await this.api.post({
      path: Constants.ApiPath.CREATE_SECURITY,
      data: type,
    })
    return result
  }
  async createMany(data) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_SECURITIES,
      data: data,
    })
    return result
  }
  async updateOne(id, type) {
    const result = await this.api.put({
      path: Constants.ApiPath.UPDATE_SECURITY(id),
      data: type,
    })
    return result
  }
  async deleteOne(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_SECURITY(id),
    })
    return result
  }
  async deleteMany(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_SECURITIES,
      data: { ids },
    })
    return result
  }
}

export default SecurityService
