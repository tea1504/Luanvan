import Constants from 'src/constants'
import BaseService from './base.service'

class TestService extends BaseService {
  async getTests() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_TEST,
    })
    return result
  }
  async getTest2() {
    const result = await this.api.get({
      path: Constants.ApiPath.GET_TEST_2,
      config: {
        onDownloadProgress: (progressEvent) => {
          new Promise((resolve) => resolve(progressEvent))
        },
      },
    })
    return result
  }
}

export default TestService
