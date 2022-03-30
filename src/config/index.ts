const isDev = import.meta.env.DEV;

export default {
  isDev,
  baseURL: isDev ? "http://127.0.0.1:7001" : "https://movie.api.hellowmonkey.cc",
  successCode: 200,
  breakpoints: { xs: 0, s: 640, m: 1024, l: 1280, xl: 1536, xxl: 1920 },
  playbackRates: [0.5, 1, 1.25, 1.5, 2, 3],
  appId: 1,
};
