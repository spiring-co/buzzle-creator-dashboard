const baseUrl = process.env.REACT_APP_API_URL;

const login = async (email, password) => {
  const response = await fetch(baseUrl + "/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const jwtoken = await response.text();
  localStorage.setItem("jwtoken", jwtoken);

  return jwtoken;
};

const logout = async () => {
  localStorage.removeItem("jwtoken");
  return true;
};

//TODO define isTokenValid method

export { login, logout };
