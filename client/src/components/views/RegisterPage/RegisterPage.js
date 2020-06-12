import React, {useState} from "react";
import { registerUser } from "../../../_actions/user_action";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router-dom";

const RegisterPage = (props) => {

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onChangeNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onChangePasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onChangeConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(password !== confirmPassword){
      return alert("비밀번호와 비림번호 확인이 다릅니다.")
    }

    const body = {
      email: email,
      name: name,
      password: password,
    };

    dispatch(registerUser(body)).then((response) => {
      if(response.payload.success) {
        props.history.push('/')
      } else {
        alert('Failed to sign up')
      }
    });
  };

  return(
      <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
          }}
      >
        <form
            style={{
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={onSubmitHandler}
        >
          <label>Email</label>
          <input type="email" value={email} onChange={onChangeEmailHandler} />

          <label>Name</label>
          <input type="text" value={name} onChange={onChangeNameHandler} />

          <label>Password</label>
          <input type="password" value={password} onChange={onChangePasswordHandler} />

          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={onChangeConfirmPasswordHandler} />

          <br />

          <button>Register</button>
        </form>
      </div>
  )
}

export default withRouter(RegisterPage)
