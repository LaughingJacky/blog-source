module.exports = ({ plugins, actions }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GITALK_ID: JSON.stringify(process.env.GITALK_ID),
        GITALK_SECRET: JSON.stringify(process.env.GITALK_SECRET),
      }),
      plugins.contextReplacement(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${['javascript', 'bash'].join('|')})$`),
      ),
    ],
  })
}
