import React from "react";
import PropTypes from "prop-types";
import useInput from "../hooks/useInput";

function LoginInput({ login }) {
  const [username, onUsernameChange] = useInput("");
  const [password, onPasswordChange] = useInput("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    login({
      username,
      password,
    });
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="login-input">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={onUsernameChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={onPasswordChange}
      />
      <button>Masuk</button>
    </form>
  );
}

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginInput;
