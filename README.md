# gatsby-source-s3

[![Build Status](https://travis-ci.org/DSchau/gatsby-source-s3.svg?branch=master)](https://travis-ci.org/DSchau/gatsby-source-s3)

Source plugin for pulling in S3 data from AWS for further processing via Gatsby/GraphQL

## Install

```bash
npm install gatsby-source-s3 --save-dev
```

## How to use

In your `gatsby-config.js`:

```javascript
plugins: [
  {
    resolve: 'gatsby-source-s3',
    options: {
      aws: {
        accessKeyId: 'youraccesskeyhere',
        secretAccessKey: 'hunter2',
        sessionToken: 'yoursessiontokenhere', // optional session token
      },
      buckets: ['your-s3-bucket-name'],
    },
  },
];
```

Once added to `gatsby-config.js` S3 objects can be queried with the queries `allS3Object` and/or `allS3Image` if an image node is detected. An example query is below:

```graphql
query IndexQuery {
  allS3Image {
    edges {
      node {
        Key
        Url
      }
    }
  }
}
```

### Image processing

This plugin also sources any detected images in the S3 bucket(s) for local processing with sharp/Gatsby. Install gatsby-transformer-sharp, gatsby-plugin-sharp to tie into this processing.

```graphql
query IndexQuery {
  images: allS3Image {
    edges {
      node {
        file: localFile {
          image: childImageSharp {
            sizes(maxWidth: 400, maxHeight: 400) {
              ...GatsbyImageSharpSizes_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
}
```
