import { useState } from "react";
import { Link } from "react-router-dom";

import { resetPassword } from "../services/firebase/auth";

import "../assets/styles/ForgotPassword.css";


function ForgotPassword(){

  const [email,setEmail] = useState("");

  const [message,setMessage] = useState("");

  const [error,setError] = useState("");


  const handleReset = async(e)=>{

    e.preventDefault();

    setMessage("");
    setError("");


    try{

      await resetPassword(email);


      setMessage(
        "Password reset link sent to your email."
      );


    }

    catch(error){


      setError(
        error.message
      );


    }

  };


  return(

    <div className="forgot-container">


      <div className="forgot-card">


        <h1>
          Forgot Password?
        </h1>


        <p>
          Enter your email and we will send you a password reset link.
        </p>



        <form onSubmit={handleReset}>


          <input

            type="email"

            placeholder="Enter your email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            required

          />



          <button type="submit">

            Send Reset Link

          </button>


        </form>



        {
          message &&

          <p className="success-message">

            {message}

          </p>

        }



        {
          error &&

          <p className="error-message">

            {error}

          </p>

        }



        <Link to="/login">

          Back to Login

        </Link>


      </div>


    </div>

  );

}


export default ForgotPassword;