/* eslint-disable no-extend-native */
if (!Array.prototype.flat) {
  Array.prototype.flat = function (count) {
    let c = count || 1;
    const len = this.length;
    let exe = [];
    if (this.length === 0) {
      return this;
    }
    while (c--) {
      const _arr = [];
      let flag = false;
      if (exe.length === 0) {
        flag = true;
        for (let i = 0; i < len; i++) {
          if (Array.isArray(this[i])) {
            exe.push(...this[i]);
          } else {
            exe.push(this[i]);
          }
        }
      } else {
        for (let i = 0; i < exe.length; i++) {
          if (Array.isArray(exe[i])) {
            flag = true;
            _arr.push(...exe[i]);
          } else {
            _arr.push(exe[i]);
          }
        }
        exe = _arr;
      }
      if (!flag && c === Infinity) {
        break;
      }
    }
    return exe;
  };
}
