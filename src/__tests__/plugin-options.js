const getSchema = () => {
  delete require.cache[require.resolve('../plugin-options')];
  return require('../plugin-options').schema;
};

const getAwsCredentials = () => {
  return {
    secretAccessKey: 'ha',
    accessKeyId: 'no',
  };
};

const setEnvVars = vars => {
  Object.keys(vars).forEach(key => {
    process.env[key] = vars[key];
  });

  return () => {
    Object.keys(vars).forEach(key => delete process.env[key]);
  };
};

test('it throws when aws key is not specified', async () => {
  try {
    await getSchema().validate({
      buckets: ['test'],
    });
  } catch (e) {
    expect(e.message).toEqual(
      expect.stringMatching(/aws.+is a required field/)
    );
  }
});

test('it throws when buckets are not defined', async () => {
  try {
    await getSchema().validate({
      aws: getAwsCredentials(),
    });
  } catch (e) {
    expect(e.message).toBe('buckets is a required field');
  }
});

test('it throws when empty buckets', async () => {
  try {
    await getSchema().validate({
      aws: getAwsCredentials(),
      buckets: [],
    });
  } catch (e) {
    expect(e.message).toBe('buckets is a required field');
  }
});

test('it passes with correct config', async () => {
  try {
    await getSchema().validate({
      aws: getAwsCredentials(),
      buckets: ['photos.dustinschau.com'],
    });
  } catch (e) {
    expect(e).toEqual(expect.any(Error));
  } finally {
    expect.assertions(0);
  }
});

test('it passes with environment variables configured', async () => {
  const vars = {
    AWS_ACCESS_KEY_ID: '1234',
    AWS_SECRET_ACCESS_KEY: 'hunter2',
  };
  const reset = setEnvVars(vars);

  const schema = await getSchema().validate({
    buckets: ['photos.dustinschau.com'],
  });

  expect(schema).toEqual(
    expect.objectContaining({
      aws: {
        accessKeyId: vars.AWS_ACCESS_KEY_ID,
        secretAccessKey: vars.AWS_SECRET_ACCESS_KEY,
      },
    })
  );

  reset();
});
