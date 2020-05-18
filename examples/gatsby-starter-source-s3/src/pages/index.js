import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

const IndexPage = ({ data }) => (
  <>
    <h1>{data.site.siteMetadata.title}</h1>
    {data.allS3Object.nodes.map(image => (
      <Img fixed={image.localFile.childImageSharp.fixed} alt={image.Key} />
    ))}
  </>
);

export const IMAGES_QUERY = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allS3Object {
      nodes {
        Key
        localFile {
          childImageSharp {
            fixed(width: 256) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
