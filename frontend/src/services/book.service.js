import Constants from 'src/constants'
import BaseService from './base.service'

class BookService extends BaseService {
  async getBooks(limit = 10, pageNumber = 0) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_BOOKS(limit, pageNumber),
    })
    return result
  }
  async getBook(id) {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_BOOK(id),
    })
    return result
  }
  async createBook(data) {
    const result = await this.api.post({
      path: Constants.ApiPath.CREATE_BOOK,
      data: data,
    })
    return result
  }
  async updateBook(id, data) {
    const result = await this.api.put({
      path: Constants.ApiPath.UPDATE_BOOK(id),
      data: data,
    })
    return result
  }
  async deleteBook(id) {
    const result = await this.api.delete({
      path: Constants.ApiPath.DELETE_BOOK(id),
    })
    return result
  }
}

export default BookService
