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
