const strapiBaseUri = process.env.API_URL || "http://localhost:1337";

export default {
  env: {
    strapiBaseUri,
  },
  head: {
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Staatliches",
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    "uikit/dist/css/uikit.min.css",
    "uikit/dist/css/uikit.css",
    "@assets/css/main.css",
  ],

  plugins: [{ src: "~/plugins/uikit.js", ssr: false }, "~/plugins/api.js"],
  modules: ["@nuxtjs/markdownit", "@nuxtjs/axios"],
  markdownit: {
    preset: "default",
    linkify: true,
    breaks: true,
    injected: true,
    html: true,
  },
};
