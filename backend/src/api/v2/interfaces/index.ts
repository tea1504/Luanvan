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

export interface LanguageModel {
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

export interface StatusModel {
  _id?: String;
  name: String;
  description?: String;
  color?: String;
  deleted?: Boolean;
  createdAt?: String;
  updatedAt?: String;
  __v: Number;
}

export interface SecurityModel {
  _id?: String;
  name: String;
  description?: String;
  color?: String;
  deleted?: Boolean;
  createdAt?: String;
  updatedAt?: String;
  __v: Number;
}

export interface PriorityModel {
  _id?: String;
  name: String;
  description?: String;
  color?: String;
  deleted?: Boolean;
  createdAt?: String;
  updatedAt?: String;
  __v: Number;
}

export interface File {
  fieldname: String;
  originalname: String;
  encoding: String;
  mimetype: String;
  destination: String;
  filename: String;
  path: String;
  size: String;
}
