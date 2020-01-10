jest.mock('aws-sdk');
import { listObjects } from '../list-objects';
import AWS from 'aws-sdk';

let s3;
beforeEach(() => {
  s3 = new AWS.S3();
  AWS.S3.reset();
});

test('it can get a bucket website', async () => {
  s3.listObjectsV2.mockReturnValueOnce({
    promise: () =>
      Promise.resolve({
        Contents: [],
      }),
  });
  const allObjects = await listObjects('photos.dustinschau.com');

  allObjects.forEach(({ Contents }) => {
    expect(Contents).toEqual(expect.any(Array));
  });
});
