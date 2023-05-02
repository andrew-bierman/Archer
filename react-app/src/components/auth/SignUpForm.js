import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp, login } from "../../store/session";
import { isEmail } from "../utility";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();

    if (password === repeatPassword) {
      dispatch(signUp(username, email, password));
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  const updateUsername = (e) => {
    if (e.target.value.length < 255) {
      if (errors.length > 0) {
        const remainingErrors = errors.filter(
          (i) => i !== "User Name length must be less than 255 characters"
        );
        setErrors(remainingErrors);
      }
    } else {
      if (
        !errors.includes("User Name length must be less than 255 characters")
      ) {
        const newErrors = [
          ...errors,
          "User Name length must be less than 255 characters",
        ];
        setErrors(newErrors);
        return;
      }
    }
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    if (isEmail(e.target.value) === false) {
      if (!errors.includes("Please enter a valid email address")) {
        let newErrors = [...errors, "Please enter a valid email address"];
        setErrors(newErrors);
      }
    } else {
      if (errors.length > 0) {
        const remainingErrors = errors.filter(
          (i) => i !== "Please enter a valid email address"
        );
        setErrors(remainingErrors);
      }
    }
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    if (repeatPassword === e.target.value) {
      if (errors.length > 0) {
        const remainingErrors = errors.filter(
          (i) =>
            i !==
            "Confirm Password field must be the same as the Password field"
        );
        setErrors(remainingErrors);
      }
    }
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    if (password === e.target.value)
      if (errors.length > 0) {
        const remainingErrors = errors.filter(
          (i) =>
            i !==
            "Confirm Password field must be the same as the Password field"
        );
        setErrors(remainingErrors);
      }
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  const handleDemoUserClick = async () => {
    dispatch(login("demo@aa.io", "password"));
  };

  return (
    <div className="signup-page-container">
      <div className="signup-page-splash-image-container">
        <h1>Sign Up</h1>
      </div>
      <div className="signup-form-container">
        <form onSubmit={onSignUp}>
          <div>
            {errors?.map((error, ind) => (
              <div key={ind} className="signup-form-errors">
                {error}
              </div>
            ))}
          </div>
          <div>
            {/* <label>User Name</label> */}
            <input
              type="text"
              name="username"
              placeholder="User Name"
              autocomplete="on"
              onChange={updateUsername}
              value={username}
              minLength="1"
              maxLength="255"
              required
            ></input>
          </div>
          <div>
            {/* <label>Email</label> */}
            <input
              type="text"
              name="email"
              placeholder="Email"
              autocomplete="on"
              onChange={updateEmail}
              value={email}
              minLength="1"
              maxLength="255"
              required
            ></input>
          </div>
          <div>
            {/* <label>Password</label> */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              autocomplete="on"
              onChange={updatePassword}
              value={password}
              minLength="1"
              maxLength="255"
              required
            ></input>
          </div>
          <div>
            {/* <label>Repeat Password</label> */}
            <input
              type="password"
              name="repeat_password"
              placeholder="Confirm Password"
              autocomplete="on"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
              minLength="1"
              maxLength="255"
            ></input>
          </div>
          <button disabled={errors.length > 0} type="submit">
            Sign Up
          </button>
          <button onClick={() => handleDemoUserClick()}>Demo User</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
