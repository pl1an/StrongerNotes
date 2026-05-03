// Set env vars before any module is imported — dotenv will not overwrite these
process.env.NODE_ENV = 'test';
process.env.PORT = '3334';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test';
process.env.JWT_SECRET = 'test_secret_key_must_be_32_characters_ok';
