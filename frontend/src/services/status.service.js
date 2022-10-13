import Constants from 'src/constants'
import BaseService from './base.service'

class StatusService extends BaseService {
  async getMany(limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_STATUSES(limit, pageNumber, filter),
    })
    return result
  }
  async getOne(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_STATUS(id),
    })
    return result
  }
  async createOne(type) {
    const result = await this.api.post({
      path: Constants.ApiPath.CREATE_STATUS,
      data: type,
    })
    return result
  }
  async createMany(data) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_STATUSES,
      data: data,
    })
    return result
  }
  async updateOne(id, type) {
    const result = await this.api.put({
      path: Constants.ApiPath.UPDATE_STATUS(id),
      data: type,
    })
    return result
  }
  async deleteOne(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_STATUS(id),
    })
    return result
  }
  async deleteMany(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_STATUSES,
      data: { ids },
    })
    return result
  }
}

export default StatusService
