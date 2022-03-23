export type KeyType = string | number;

export type ObjType = {
  [prop: KeyType]: any;
};

export type FunType = (...args: any[]) => any;

export type StorageType = {
  id: number | string;
  url: string;
  md5?: string;
};

// export type NumberBoolean = 0 | 1;

export type TableData = {
  column: any;
  index: number;
  record: any;
  text: any;
};
export type UploadChangeParam = {
  file: any;
  fileList: any[];
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
