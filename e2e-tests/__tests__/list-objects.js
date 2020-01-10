import { config as loadEnv } from 'dotenv';
import { listObjects } from '../../src/list-objects';

loadEnv();

const getAWSConfig = () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

test('it gets objects from s3', async () => {
  const objects = await listObjects('photos.dustinschau.com', getAWSConfig());

  objects.forEach(({ Contents }) => {
    expect(Contents.length).toBeGreaterThan(0);

  });
});

test('it respects max keys', async () => {
  const MAX_KEYS = 1;
  const objects = await listObjects('photos.dustinschau.com', getAWSConfig(), MAX_KEYS);

  objects.forEach(({ Contents }) => {
    console.log(JSON.stringify(Contents, null, 2));
    expect(Contents.length).not.toBeGreaterThan(MAX_KEYS);
  });
});
