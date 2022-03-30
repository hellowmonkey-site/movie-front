const globalThis = window;

function openCallback() {
  const baidu = "https://www.baidu.com";
  try {
    globalThis.open(baidu, "_self");
  } catch (e) {
    const btn = document.createElement("button");
    btn.onclick = function () {
      globalThis.open(baidu, "_self");
    };
    btn.click();
  }
}

export function initSecure() {
  //禁止F12键盘事件
  document.addEventListener("keydown", event => {
    return 123 != event.keyCode || (event.returnValue = false);
  });
  //禁止右键、选择、复制
  document.addEventListener("contextmenu", event => {
    return (event.returnValue = false);
  });

  const threshold = 160;
  let timer: NodeJS.Timer;
  function main() {
    clearTimeout(timer);
    const widthThreshold = globalThis.outerWidth - globalThis.innerWidth > threshold;
    const heightThreshold = globalThis.outerHeight - globalThis.innerHeight > threshold;
    if (!(heightThreshold && widthThreshold) && (widthThreshold || heightThreshold)) {
      alert("请勿打开控制台好吧！！！");
      openCallback();
    }
    timer = setTimeout(main, 3000);
  }

  main();
}
