import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Logo from '../assets/logo.svg';
import { loginRoute } from '../utils/APIRoutes';


const Login = () => {

  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    theme: "dark"
  }

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {

      console.log("In validation, loginRoute:", loginRoute);

      const { password, username } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password
        });

        console.log("Response data:", data);

        if (data.status === false) {
          toast.error(data.msg, toastOption);
        }

        if (data.status === true) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.user));
          navigate("/");
        }

      } catch (error) {
        console.error("Error during login:", error);
        toast.error("Something went wrong. Please try again.", toastOption);
      }
    }
  }

  const handleValidation = () => {
    const { password, username } = values;

    if (username.trim() === "" || password.trim() === "") {
      toast.error(
        "Username and password are required", toastOption
      );
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Spark Chat</h1>
          </div>

          <input
            type="text"
            placeholder='username'
            name='username'
            onChange={(e) => handleChange(e)}
            min="3"
          />

          <input
            type="password"
            placeholder='password'
            name='password'
            onChange={(e) => handleChange(e)}
          />

          <button type='submit'>Login</button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>

        </form>
      </FormContainer>

      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`

    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;

        img {
            height: 5rem;
        }
        
        h1 {
            color: white;
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 4rem;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-redius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        
        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;

            &:hover {
                background-color: #4e0eff;
            }
        }
        
        span {
            color: white;
            text-transform: uppercase;

            a {
                color: 4e0eff;
                text-decoration: none;
                font-weight: bold
            }
        }
    }

`;

export default Login