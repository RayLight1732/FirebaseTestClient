const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    entry1: "./src/login.js",
    entry2: "./src/top.js",
    entry3: "./src/mypage.js",
    entry4: "./src/upload.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
