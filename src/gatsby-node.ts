import { createRemoteFileNode } from "gatsby-source-filesystem";
import AWS = require("aws-sdk");

const isImage = (key: string): boolean =>
  /\.(jpe?g|png|webp|tiff?)$/i.test(key);

type pluginOptionsType = {
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  buckets: string[];
};

type ObjectType = AWS.S3.Object & { Bucket: string };

// source all objects from s3
export async function sourceNodes(
  { actions: { createNode }, createNodeId, createContentDigest, reporter },
  pluginOptions: pluginOptionsType
) {
  const { aws: awsConfig, buckets } = pluginOptions;

  // configure aws
  AWS.config.update(awsConfig);

  // get objects
  const s3 = new AWS.S3();

  const listObjects = async bucket => {
    // todo improve this call
    // see https://stackoverflow.com/a/49888947
    const response = await s3
      .listObjectsV2({
        Bucket: bucket
        // todo handle continuation token
        // ContinuationToken: token,
      })
      .promise();

    // add bucket key
    const objects = response.Contents?.reduce((acc: ObjectType[], cur) => {
      const object: ObjectType = { ...cur, Bucket: bucket };
      acc.push(object);
      return acc;
    }, []);

    return objects;
  };

  try {
    let objects: Array<any> = await Promise.all(
      buckets.map(bucket => listObjects(bucket))
    );
    // flatten objects
    // flat() is not supported in node 10
    objects = [].concat(...objects);

    // create file nodes
    // todo touch nodes if they exist already
    objects?.forEach(async object => {
      const { Key, Bucket } = object;
      const { region } = awsConfig;

      createNode({
        ...object,
        // construct url
        Url: `https://s3.${
          region ? `${region}.` : ""
        }amazonaws.com/${Bucket}/${Key}`,
        // node meta
        id: createNodeId(`s3-object-${Key}`),
        parent: null,
        children: [],
        internal: {
          type: "S3Object",
          content: JSON.stringify(object),
          contentDigest: createContentDigest(object)
        }
      });
    });
  } catch (error) {
    reporter.error(error);
  }
}

export async function onCreateNode({
  node,
  actions: { createNode },
  store,
  cache,
  reporter,
  createNodeId
}) {
  if (node.internal.type === "S3Object" && node.Key && isImage(node.Key)) {
    try {
      // download image file and save as node
      const imageFile = await createRemoteFileNode({
        url: node.Url,
        parentNodeId: node.id,
        store,
        cache,
        reporter,
        createNode,
        createNodeId
      });

      if (imageFile) {
        // add local image file to s3 object node
        node.localFile___NODE = imageFile.id; // eslint-disable-line @typescript-eslint/camelcase
      }
    } catch (error) {
      reporter.error(error);
    }
  }
}
