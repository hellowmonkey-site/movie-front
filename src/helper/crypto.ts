const defaultXor = 125;
const defaultHex = 25;
export function encrypto(str: string, xor = defaultXor, hex = defaultHex): string {
  if (typeof str !== "string" || typeof xor !== "number" || typeof hex !== "number") {
    return "";
  }

  const resultList = [];
  hex = hex <= 25 ? hex : hex % 25;

  for (let i = 0; i < str.length; i++) {
    // 提取字符串每个字符的ascll码
    let charCode = str.charCodeAt(i);
    // 进行异或加密
    charCode = (charCode * 1) ^ xor;
    // 异或加密后的字符转成 hex 位数的字符串
    const newCode = charCode.toString(hex);
    resultList.push(newCode);
  }

  const splitStr = String.fromCharCode(hex + 97);
  const resultStr = resultList.join(splitStr);
  return resultStr;
}

export function decrypto(str: string, xor = defaultXor, hex = defaultHex): string {
  if (typeof str !== "string" || typeof xor !== "number" || typeof hex !== "number") {
    return "";
  }
  let strCharList = [];
  const resultList = [];
  hex = hex <= 25 ? hex : hex % 25;
  // 解析出分割字符
  const splitStr = String.fromCharCode(hex + 97);
  // 分割出加密字符串的加密后的每个字符
  strCharList = str.split(splitStr);

  for (let i = 0; i < strCharList.length; i++) {
    // 将加密后的每个字符转成加密后的ascll码
    let charCode = parseInt(strCharList[i], hex);
    // 异或解密出原字符的ascll码
    charCode = (charCode * 1) ^ xor;
    const strChar = String.fromCharCode(charCode);
    resultList.push(strChar);
  }
  const resultStr = resultList.join("");
  return resultStr;
}
