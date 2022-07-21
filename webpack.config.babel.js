import { IgnorePlugin } from "webpack";
import path from "path";

export default (env, args) => {
  const isProduction = args.mode === "production";
  const devtool = !isProduction && "inline-source-map";
  const rules = [
    {
      test: /\.jsx?$/,
      use: ["babel-loader"],
    },
  ];

  if (!isProduction) {
    rules.push({
      enforce: "pre",
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "eslint-loader",
          options: {
            configFile: path.join(__dirname, "src/.eslintrc.js"),
          },
        },
      ],
    });
  }

  return {
    devtool,
    entry: "./src/entries/app.jsx",
    output: {
      path: path.join(__dirname, "./public/js/"),
      filename: "app.js",
    },
    module: { rules },
    resolve: {
      modules: ["node_modules"],
      alias: {
        "~": path.join(__dirname, "./src/"),
      },
      extensions: [".js", ".jsx"],
    },
    plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],
  };
};
