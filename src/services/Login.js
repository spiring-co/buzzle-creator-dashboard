import React from "react";
const config = { hostUrl: "https://pharaoh-api.herokuapp.com/auth/login" }; //https://pharaoh-api.herokuapp.com/auth/login
function Login() {
  let ResIsOk = {}; //stores response to check if response is 200
  const handleSubmit = s => {
    s.preventDefault();

    if (s.target.value == 0) {
      console.log("empty input");
      return false;
    } else {
      const { target: { elements } = {} } = s;
      const d = {
        email: elements["email"].value,
        password: elements["password"].value
      };
      console.log(d);
      sendDetails({ d });
    }
  };

  const sendDetails = async data => {
    const sData = { email: data.d.email, password: data.d.password };
    fetch(config.hostUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sData)
    })
      .then(response => {
        response.text();
        ResIsOk = response.status;
      })
      .then(data => {
        console.log("Success:", data);
        localStorage.setItem("JWT", data);
        if (ResIsOk == 200) return window.location.assign("/home");
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1> Creator Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" placeholder="Enter email" name="email" />
          <input type="password" placeholder="Enter password" name="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
