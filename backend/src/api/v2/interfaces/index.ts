export interface ResponseResult {
  code: Number;
  message: String;
  data?: any;
}

export interface TypeModel {
  _id?: String;
  name: String;
  notation: String;
  description?: String;
  color?: String;
  deleted?: Boolean;
  createdAt?: String;
  updatedAt?: String;
  __v: Number;
}
