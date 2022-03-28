export type KeyType = string | number;

export type ObjType = {
  [prop: KeyType]: any;
};

export type FunType = (...args: any[]) => any;

export type ResponseData = {
  status: number;
  data: any;
  message: string;
};

export type PageData<T = any> = {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  pageSize: number;
};
