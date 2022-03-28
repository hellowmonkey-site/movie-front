const isDev = import.meta.env.DEV;

export default {
  baseURL: isDev ? "http://127.0.0.1:7001" : "https://movie.api.hellowmonkey.cc",
  successCode: 200,
  breakpoint: 640,
};
