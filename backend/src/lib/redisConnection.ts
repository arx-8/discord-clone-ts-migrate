import redisObject from 'redis';

let subConnection: $TSFixMe;
let con: $TSFixMe;

const createConnection = function () {
  const redis = redisObject.createClient({
    url: process.env.REDIS_HOST,
  });

  redis.on('connect', function () {
    console.log('Connected to Redis');
  });
  redis.on('Error', function (err) {
    console.log('er', err);
  });

  redis.connect();

  return redis;
};

const createSubConnection = async function () {
  const redis = redisObject.createClient({ url: process.env.REDIS_HOST });
  redis.on('connect', function () {
    console.log('Redis subscribe Connected');
  });
  redis.on('Error', function (err) {
    console.log('er', err);
  });

  // await redis.connect();

  return redis;
};

export const getSubConnection = async function () {
  if (!subConnection) {
    subConnection = await createSubConnection();
  }

  return subConnection;
};

export const getConnection = function () {
  if (!con) con = createConnection();

  return con;
};
