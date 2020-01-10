const config = {
  update: jest.fn(),
};

class S3 {
  static spies = {
    listObjectsV2: jest.fn(),
  };

  static reset = () => {
    Object.keys(S3.spies).forEach(key => S3.spies[key].mockReset());
  };

  listObjectsV2 = S3.spies.listObjectsV2;
}

module.exports = {
  config,
  S3,
};
