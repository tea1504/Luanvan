import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import BaseService from './base.service'

class IODService extends BaseService {
  async getMany(limit = 10, pageNumber = 1, filter = '', params = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_IODS(limit, pageNumber, filter, params),
    })
    return result
  }
  async getOne(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_IOD(id),
    })
    return result
  }
  async getFile(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_FILE_IOD(id),
    })
    return result
  }
  async getNewArrivalNumber(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_NEW_ARRIVAL_NUMBER,
    })
    return result
  }
  // async getManyByOrganId(id, limit = 10, pageNumber = 1, filter = '') {
  //   const result = await this.api.get({
  //     path: Constants.ApiPath.GET_OFFICERS_BY_ORGAN_ID(id, limit, pageNumber, filter),
  //   })
  //   return result
  // }
  async createOne(data) {
    var formData = new FormData()
    Object.keys(data).forEach((el) => data[el] === null && delete data[el])
    for (const [key, value] of Object.entries(data)) {
      if (key == 'handler' || key == 'file') {
        Array.from(value).map((el) => {
          formData.append(key, el)
        })
      } else {
        formData.append(key, value)
      }
    }
    const result = await this.api.postFormData({
      path: Constants.ApiPath.CREATE_IOD,
      data: formData,
    })
    return result
  }
  // async createMany(data) {
  //   const result = await this.api.postFormData({
  //     path: Constants.ApiPath.CREATE_OFFICERS,
  //     data: data,
  //   })
  //   return result
  // }
  async approval(id, data) {
    const result = await this.api.put({
      path: Constants.ApiPath.APPROVE_IOD(id),
      data: data,
    })
    return result
  }
  async cancelApproval(id, data) {
    const result = await this.api.put({
      path: Constants.ApiPath.APPROVE_CANCEL_IOD(id),
      data: data,
    })
    return result
  }
  async handle(id, data) {
    data.command = Helpers.htmlDecode(data.command)
    data.security = data.security._id
    var formData = new FormData()
    Object.keys(data).forEach((el) => data[el] === null && delete data[el])
    for (const [key, value] of Object.entries(data)) {
      if (key == 'newHandler' || key == 'newFile') {
        Array.from(value).map((el) => {
          formData.append(key, el)
        })
      } else {
        formData.append(key, value)
      }
    }
    const result = await this.api.putFormData({
      path: Constants.ApiPath.HANDLE(id),
      data: formData,
    })
    return result
  }
  async refuse(id, data) {
    const result = await this.api.put({
      path: Constants.ApiPath.REFUSE(id),
      data: data,
    })
    return result
  }
  // async deleteOne(id) {
  //   const result = await this.api.delete({
  //     path: Constants.ApiPath.DELETE_OFFICER(id),
  //   })
  //   return result
  // }
  // async deleteMany(ids) {
  //   const result = await this.api.delete({
  //     path: Constants.ApiPath.DELETE_OFFICERS,
  //     data: { ids },
  //   })
  //   return result
  // }
}

export default IODService
