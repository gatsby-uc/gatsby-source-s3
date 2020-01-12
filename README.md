# gatsby-source-s3

A Gatsby plugin to source objects and images from AWS S3.

## Install

```bash
# with npm
npm install @robinmetral/gatsby-source-s3
# with yarn
yarn add @robinmetral/gatsby-source-s3
```

## Configure

Declare the plugin in your `gatsby-config.js`, taking care to pass your AWS
credentials as
[environment variables](https://www.gatsbyjs.org/docs/environment-variables/):

```javascript
// configure dotenv
// see https://www.gatsbyjs.org/docs/environment-variables
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-s3",
      options: {
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: "eu-central-1"
        },
        buckets: ["my-bucket-name", "other-bucket"]
      }
    }
  ]
};
```

## Query

S3 objects can be queried in GraphQL as "s3Object" of "allS3Object":

```graphql
query AllObjectsQuery {
  allS3Object {
    nodes {
      Key
      Url
    }
  }
}
```

## Image processing

Any images in your bucket(s) will be downloaded by the plugin and stored as
local files, to be processed with `gatsby-plugin-sharp` and
`gatsby-transformer-sharp`.

```bash
# with npm
npm install gatsby-plugin-sharp gatsby-transformer-sharp
# with yarn
yarn add gatsby-plugin-sharp gatsby-transformer-sharp
```

```graphql
query AllImagesQuery {
  images: allS3Object {
    nodes {
      Key
      localFile {
        childImageSharp {
          fluid(maxWidth: 1024) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
}
```

## Thanks

This plugin was based on Dustin Schau's
[`gatsby-source-s3`](https://github.com/DSchau/gatsby-source-s3/) and influenced
by Jesse Stuart's Typescript
[`gatsby-source-s3-image`](https://github.com/jessestuart/gatsby-source-s3-image).
