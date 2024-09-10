const Config = {
  DEV: {
    BE_BASE_URL: process.env.REACT_APP_BE_BASE_URL,
    FE_BASE_URL: process.env.REACT_APP_FE_BASE_URL,
    IMAGE_BASE_URL: process.env.REACT_APP_IMAGE_BASE_URL,
  },
  LOCAL: {
    BE_BASE_URL: process.env.REACT_APP_BE_BASE_URL,
    FE_BASE_URL: process.env.REACT_APP_FE_BASE_URL,
    IMAGE_BASE_URL: process.env.REACT_APP_IMAGE_BASE_URL,
  },
};

export { Config };
