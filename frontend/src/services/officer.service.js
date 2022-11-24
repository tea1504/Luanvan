import Constants from 'src/constants'
import BaseService from './base.service'

class OfficerService extends BaseService {
  async getList() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_LIST_OFFICERS,
    })
    return result
  }
  async getMany(limit = 10, pageNumber = 1, filter = '', params = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_OFFICERS(limit, pageNumber, filter, params),
    })
    return result
  }
  async getOne(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_OFFICER(id),
    })
    return result
  }
  async getManyByOrganId(id, limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_OFFICERS_BY_ORGAN_ID(id, limit, pageNumber, filter),
    })
    return result
  }
  async getManyByUser(limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_OFFICERS_BY_USER(limit, pageNumber, filter),
    })
    return result
  }
  async getNewCode() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_OFFICER_NEW_CODE,
    })
    return result
  }
  async createOne(type) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_OFFICER,
      data: type,
    })
    return result
  }
  async createMany(data) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_OFFICERS,
      data: data,
    })
    return result
  }
  async updateOne(id, type) {
    const result = await this.api.putFormData({
      path: Constants.ApiPath.UPDATE_OFFICER(id),
      data: type,
    })
    return result
  }
  async deleteOne(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_OFFICER(id),
    })
    return result
  }
  async deleteMany(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_OFFICERS,
      data: { ids },
    })
    return result
  }
}

export default OfficerService
