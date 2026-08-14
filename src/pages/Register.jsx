import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import {
  getAuthErrorMessage
} from "../services/firebase/auth";

import {
  createUserProfile
} from "../services/supabase/profiles";

import "../assets/styles/Register.css";


function Register() {


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);



  const { signup } = useAuth();

  const navigate = useNavigate();




  async function handleRegister(event) {

    event.preventDefault();


    setError("");



    if(password.length < 6){

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }



    if(password !== confirmPassword){

      setError(
        "Passwords do not match."
      );

      return;

    }



    try {


      setSubmitting(true);



      const credential = await signup(

        email,

        password

      );



      await createUserProfile({

        uid: credential.user.uid,

        name: name.trim(),

        email: credential.user.email,

      });



      navigate(
        "/dashboard",
        {
          replace:true
        }
      );



    }


    catch(error){


      setError(
        getAuthErrorMessage(error)
      );


    }


    finally{


      setSubmitting(false);


    }


  }





  return (


    <main className="register-container">



      <section className="register-info-panel">


        <h1>
          Start your interview journey
        </h1>


        <p>

          Create a free account and prepare for
          interviews with AI-powered practice.

        </p>


        <ul>

          <li>
            AI generated interview questions
          </li>

          <li>
            Resume based preparation
          </li>

          <li>
            Performance tracking
          </li>

        </ul>


      </section>





      <form
        className="register-form-panel"
        onSubmit={handleRegister}
      >


        <h1>
          Create Account
        </h1>




        <label>
          Name
        </label>


        <input

          type="text"

          placeholder="Enter your name"

          value={name}

          onChange={(e)=>setName(e.target.value)}

          required

        />





        <label>
          Email
        </label>


        <input

          type="email"

          placeholder="Enter your email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          required

        />






        <label>
          Password
        </label>



        <div className="password-field">


          <input

            type={
              showPassword
              ? "text"
              : "password"
            }


            placeholder="At least 6 characters"


            value={password}


            onChange={(e)=>setPassword(e.target.value)}


            required


          />



          <button

            type="button"

            className="password-toggle"

            onClick={()=>
              setShowPassword(!showPassword)
            }

          >

            {
              showPassword
              ?
              <FaEyeSlash/>
              :
              <FaEye/>
            }


          </button>


        </div>







        <label>
          Confirm Password
        </label>



        <div className="password-field">


          <input


            type={
              showConfirmPassword
              ?
              "text"
              :
              "password"
            }


            placeholder="Re-enter password"


            value={confirmPassword}


            onChange={(e)=>
              setConfirmPassword(e.target.value)
            }


            required



          />



          <button

            type="button"

            className="password-toggle"


            onClick={()=>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }


          >


            {
              showConfirmPassword
              ?
              <FaEyeSlash/>
              :
              <FaEye/>
            }


          </button>



        </div>






        {
          error &&

          <p className="register-error">

            {error}

          </p>

        }






        <button

          className="register-submit-btn"

          type="submit"

          disabled={submitting}

        >

          {
            submitting
            ?
            "Creating Account..."
            :
            "Register"
          }


        </button>






        <p className="register-signin">


          Already have an account?


          <Link to="/login">

            Sign In

          </Link>


        </p>




      </form>




    </main>


  );


}



export default Register;