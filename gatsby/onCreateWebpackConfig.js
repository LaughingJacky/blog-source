module.exports = ({ plugins, actions }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GITALK_ID: JSON.stringify(process.env.GITALK_ID || '7d15c5c496b35e601dae'),
        GITALK_SECRET: JSON.stringify(process.env.GITALK_SECRET ||'25fb2be35286f43cd6e59167fcd2b98c2dc5500f')
      }),
      plugins.contextReplacement(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${['javascript', 'bash'].join('|')})$`),
      ),
    ],
  })
}
