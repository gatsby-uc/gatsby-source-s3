jest.mock('aws-sdk');
import { sourceNodes } from '../gatsby-node';
import AWS from 'aws-sdk';

let s3;
beforeEach(() => {
  s3 = new AWS.S3();
  AWS.S3.reset();
});

const getGatsbyNodeAPIConfig = (spy = jest.fn()) => ({
  boundActionCreators: {
    createNode: spy,
  },
  cache: {
    get: jest.fn(),
    set: jest.fn(),
  },
});

const getPluginOptions = () => ({
  aws: {
    accessKeyId: 'hunter2',
    secretAccessKey: 'hahayaright',
  },
  buckets: ['photos.dustinschau.com'],
});

const getS3Objects = (Name = 'photos.dustinschau.com') => ({
  Contents: [
    {
      Key: 'img-1234.JPG',
    },
    {
      Key: 'hello-world.txt',
    },
  ],
  Name,
});

test('it gets objects from s3', async () => {
  s3.listObjectsV2.mockReturnValueOnce({
    promise: () => Promise.resolve(getS3Objects()),
  });
  const objects = await sourceNodes(
    getGatsbyNodeAPIConfig(),
    getPluginOptions()
  );

  objects.forEach(bucketContents => {
    expect(bucketContents).toEqual(
      expect.objectContaining({
        Contents: expect.any(Array),
        Name: expect.any(String),
      })
    );
  });
});

test('it calls create node', async () => {
  s3.listObjectsV2.mockReturnValueOnce({
    promise: () => Promise.resolve(getS3Objects()),
  });
  const spy = jest.fn();
  await sourceNodes(getGatsbyNodeAPIConfig(spy), getPluginOptions());

  expect(spy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      Url: expect.any(String),
      Name: expect.any(String),
      children: [],
      id: expect.stringContaining('s3-'),
      internal: {
        content: expect.any(String),
        contentDigest: expect.any(String),
        type: expect.stringMatching(/^S3/),
      },
    })
  );
});

test('it only calls image createNode on image nodes', async () => {
  s3.listObjectsV2.mockReturnValueOnce({
    promise: () => Promise.resolve(getS3Objects()),
  });
  const spy = jest.fn();
  await sourceNodes(getGatsbyNodeAPIConfig(spy), getPluginOptions());

  const imageCall = spy.mock.calls.filter(([call]) => {
    return call.internal.type === 'S3Image';
  });

  expect(imageCall).toHaveLength(1);
});
