import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

const Auth = (SpecificComponent, option, adminRout = null) => {
  function AuthenticationCheck(props) {

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then(response => {
        console.log(response)

        if(!response.payload.isAuth) {
          if(option) {
            props.history.push('/login')
          }
        } else {
          if(adminRout && !response.payload.isAdmin) {
            props.history.push('/')
          } else {
            if(option === false)
              props.history.push('/')
          }
        }
      })
    });

    return (
        <SpecificComponent />
    )
  }

  return AuthenticationCheck;
}

export default Auth
