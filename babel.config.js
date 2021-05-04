module.exports = {
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    ["@babel/plugin-proposal-nullish-coalescing-operator"]
  ],
  presets: [
      "@babel/preset-env",
      "@babel/preset-react"
  ],
};