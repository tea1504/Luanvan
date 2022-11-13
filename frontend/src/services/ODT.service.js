import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import BaseService from './base.service'

class ODTService extends BaseService {
  async getMany(limit = 10, pageNumber = 1, filter = '', params = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_ODTS(limit, pageNumber, filter, params),
    })
    return result
  }
  async getOne(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_ODT(id),
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
    data.subject = Helpers.htmlDecode(data.subject)
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
  async updateOne(id, data) {
    data.status = data.status._id
    data.subject = Helpers.htmlDecode(data.subject)
    var formData = new FormData()
    Object.keys(data).forEach((el) => data[el] === null && delete data[el])
    for (const [key, value] of Object.entries(data)) {
      if (key == 'handler' || key == 'file') {
        Array.from(value).map((el) => {
          formData.append(key, el)
        })
      }
      if (key == 'fileTemp') {
        Array.from(value).map((el) => {
          formData.append(key, el._id)
        })
      } else {
        formData.append(key, value)
      }
    }
    const result = await this.api.putFormData({
      path: Constants.ApiPath.UPDATE_IOD(id),
      data: formData,
    })
    return result
  }
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
  async implement(id, data) {
    const result = await this.api.put({
      path: Constants.ApiPath.IMPLEMENT(id),
      data: data,
    })
    return result
  }
  async deleteOne(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_ODT(id),
    })
    return result
  }
  async deleteMany(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_ODTS,
      data: { ids },
    })
    return result
  }
  async report(start, end) {
    const result = await this.api.get({
      path: Constants.ApiPath.REPORT_IOD(start, end),
    })
    return result
  }
  async getYearReport() {
    const result = await this.api.get({
      path: Constants.ApiPath.REPORT_YEAR_IOD,
    })
    return result
  }
  async getStatisticYearMonth(year) {
    const result = await this.api.get({
      path: Constants.ApiPath.STATISTIC_IOD_YEAR_MONTH(year),
    })
    return result
  }
  async getStatisticMonthDay(year, month) {
    const result = await this.api.get({
      path: Constants.ApiPath.STATISTIC_IOD_MONTH_DATE(year, month),
    })
    return result
  }
}

export default ODTService
