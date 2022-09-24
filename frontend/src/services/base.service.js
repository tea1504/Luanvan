// import axios from 'axios'
// import cookie from 'js-cookie'

// let BaseApi = axios.create({
//     baseURL: process.env.REACT_APP_BASE_URL,
// });

// let Api = function () {
//     let token = cookie.get('jwt');

//     if (token)
//         BaseApi.defaults.headers.common['x-access-token'] = `Bearer ${token}`;

//     return BaseApi;
// }

// export default Api;

import APIAccessor from './apiProcessor'

class BaseService {
  api = APIAccessor
}

export default BaseService
