import React from "react";

const fakeData = [
  {
    email: "abcd123@gmail.com",
    password: "123@123",
  },
];

export default () => {
  const login = async (email, password) => {
    const response = await new Promise((resolve) => {
      resolve(fakeData);
    });
    return response;
  };
};
