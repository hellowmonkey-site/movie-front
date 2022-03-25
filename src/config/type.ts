export type KeyType = string | number;

export type ObjType = {
  [prop: KeyType]: any;
};

export type FunType = (...args: any[]) => any;

export type StorageType = {
  id: number | string;
  path: string;
  name?: string;
};

export type ResponseData = {
  code: number;
  data: any;
  msg: string;
};

export type TableColumnType = {
  dataIndex: string;
  key?: string;
  title: string;
  customRender?: (params: TableData) => any;
};

export type UploadFileData = {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  originFileObj: File;
  percent: number;
  response?: ResponseData;
  size: number;
  status: string;
  thumbUrl: string;
  type: string;
  uid: string;
};

export type UploadFileItem = {
  uid: string | number;
  name: string;
  status: string;
  url: string;
};

export type TableData = {
  column: any;
  index: number;
  record: any;
  text: any;
};
export type UploadChangeParam = {
  file: UploadFileData;
  fileList: UploadFileData[];
  event: any;
};

export type ExcludeAny<T, U> = T extends U ? any : T;
// 去除interface中某些属性
export type ExcludeInterface<T, E> = {
  [P in ExcludeAny<keyof T, E>]: T[P];
};

export const enum NumberBoolean {
  FALSE,
  TRUE,
}
