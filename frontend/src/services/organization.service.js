import Constants from 'src/constants'
import BaseService from './base.service'

class OrganizationService extends BaseService {
  async getMany(limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_ORGANIZATIONS(limit, pageNumber, filter),
    })
    return result
  }
  async getList() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_LIST_ORGANIZATIONS,
    })
    return result
  }
  async getOne(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_ORGANIZATION(id),
    })
    return result
  }
  async getManyByOrganId(id, limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_ORGANIZATIONS_BY_ORGAN_ID(id, limit, pageNumber, filter),
    })
    return result
  }
  async createOne(type) {
    const result = await this.api.post({
      path: Constants.ApiPath.CREATE_ORGANIZATION,
      data: type,
    })
    return result
  }
  async createMany(data) {
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_ORGANIZATIONS,
      data: data,
    })
    return result
  }
  async updateOne(id, type) {
    const result = await this.api.put({
      path: Constants.ApiPath.UPDATE_ORGANIZATION(id),
      data: type,
    })
    return result
  }
  async deleteOne(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_ORGANIZATION(id),
    })
    return result
  }
  async deleteMany(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_ORGANIZATIONS,
      data: { ids },
    })
    return result
  }
}

export default OrganizationService
