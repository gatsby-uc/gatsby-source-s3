require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: `gatsby-starter-source-s3`
  },
  plugins: [
    {
      resolve: `@robinmetral/gatsby-source-s3`,
      options: {
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        },
        buckets: ["gatsby-source-s3-example", "gatsby-source-s3-example-2"]
      }
    },
    // the sharp transformer and plugin are required to process images
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`
  ]
};
