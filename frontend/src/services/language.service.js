import Constants from 'src/constants'
import BaseService from './base.service'

class LanguageService extends BaseService {
  async getLanguages(limit = 10, pageNumber = 1, filter = '') {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_LANGUAGES(limit, pageNumber, filter),
    })
    return result
  }
  async getLanguage(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_LANGUAGE(id),
    })
    return result
  }
  async createLanguage(type) {
    const result = await this.api.post({
      path: Constants.ApiPath.CREATE_LANGUAGE,
      data: type,
    })
    return result
  }
  async updateLanguage(id, type) {
    const result = await this.api.put({
      path: Constants.ApiPath.UPDATE_LANGUAGE(id),
      data: type,
    })
    return result
  }
  async deleteLanguage(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_LANGUAGE(id),
    })
    return result
  }
  async deleteLanguages(ids) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_LANGUAGES,
      data: { ids },
    })
    return result
  }
}

export default LanguageService
