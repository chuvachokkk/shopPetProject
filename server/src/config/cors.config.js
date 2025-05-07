const configs = {
  development: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    optionsSuccessStatus: 200,
    credentials: true,
  },
};

const environment = process.env.NODE_ENV || "development";
module.exports = configs[environment];
