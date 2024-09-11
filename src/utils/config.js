const Config = {
  DEV: {
    BE_BASE_URL:
      "https://b761-2405-201-5c0f-a06c-4d7-f0b5-a355-f3ea.ngrok-free.app/api/v1/",
    FE_BASE_URL: "https://d2i-application.vercel.app/",
    IMAGE_BASE_URL:
      "https://b761-2405-201-5c0f-a06c-4d7-f0b5-a355-f3ea.ngrok-free.app/api/uploads/",
  },
  LOCAL: {
    BE_BASE_URL: "http://localhost:3000/api/v1/",
    FE_BASE_URL: "http://localhost:5173/",
    IMAGE_BASE_URL: "http://localhost:3000/api/uploads/",
  },
};

export { Config };
