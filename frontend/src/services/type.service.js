import Constants from 'src/constants'
import BaseService from './base.service'

class TypeService extends BaseService {
  async getTypes(limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_TYPES(limit, pageNumber, filter),
    })
    return result
  }
  async getType(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_TYPE(id),
    })
    return result
  }
  async createType(type) {
    const result = await this.api.post({
      path: Constants.ApiPath.CREATE_TYPE,
      data: type,
    })
    return result
  }
  async createTypes(data) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_TYPES,
      data: data,
    })
    return result
  }
  async updateType(id, type) {
    const result = await this.api.put({
      path: Constants.ApiPath.UPDATE_TYPE(id),
      data: type,
    })
    return result
  }
  async deleteType(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_TYPE(id),
    })
    return result
  }
  async deleteTypes(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_TYPES,
      data: {ids}
    })
    return result
  }
}

export default TypeService
