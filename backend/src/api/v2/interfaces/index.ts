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

export interface RightModel {
  _id?: String;
  code: Number;
  name: String;
  createOD?: Boolean;
  updateOD?: Boolean;
  deleteOD?: Boolean;
  approveOD?: Boolean;
  createOfficer?: Boolean;
  updateOfficer?: Boolean;
  deleteOfficer?: Boolean;
  createCategories?: Boolean;
  updateCategories?: Boolean;
  deleteCategories?: Boolean;
  scope?: Number;
  deleted?: Boolean;
  createdAt?: String;
  updatedAt?: String;
  __v?: Number;
}

export interface OrganizationModel {
  _id?: String;
  name: String;
  code: String;
  emailAddress: String;
  phoneNumber: String;
  organ?: String;
  deleted?: Boolean;
  createdAt?: String;
  updatedAt?: String;
  __v?: Number;
}
