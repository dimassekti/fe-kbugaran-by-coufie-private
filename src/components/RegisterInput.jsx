import React from "react";
import PropTypes from "prop-types";

class RegisterInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      username: "",
      password: "",
    };

    this.onFullnameChange = this.onFullnameChange.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onFullnameChange(event) {
    this.setState(() => {
      return {
        fullname: event.target.value,
      };
    });
  }

  onUsernameChange(event) {
    this.setState(() => {
      return {
        username: event.target.value,
      };
    });
  }

  onPasswordChange(event) {
    this.setState(() => {
      return {
        password: event.target.value,
      };
    });
  }

  onSubmitHandler(event) {
    event.preventDefault();

    this.props.register({
      username: this.state.username,
      password: this.state.password,
      fullname: this.state.fullname,
    });
  }

  render() {
    return (
      <form
        onSubmit={this.onSubmitHandler}
        className="register-input">
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={this.state.fullname}
          onChange={this.onFullnameChange}
        />
        <input
          type="text"
          placeholder="Username"
          value={this.state.username}
          onChange={this.onUsernameChange}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={this.state.password}
          onChange={this.onPasswordChange}
        />
        <button>Register</button>
      </form>
    );
  }
}

RegisterInput.propTypes = {
  register: PropTypes.func.isRequired,
};

export default RegisterInput;
