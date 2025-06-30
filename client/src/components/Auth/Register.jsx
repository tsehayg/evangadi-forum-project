import { useContext } from "react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utiltis/axiosConfig";
import classes from "./Register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";
import { AppState } from "../../App";
function Register() {
  const navigate = useNavigate();
  const { isLoggedIn, loading,setLoading } = useContext(AppState);
  // refs
  const usernameDome = useRef();
  const firstnameDome = useRef();
  const lastnameDome = useRef();
  const emailDom = useRef();
  const passwordDome = useRef();

  // states
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn]);
  const validateFields = () => {
    const newErrors = {};
    if (!usernameDome.current.value.trim()) newErrors.username = true;
    if (!firstnameDome.current.value.trim()) newErrors.firstname = true;
    if (!lastnameDome.current.value.trim()) newErrors.lastname = true;
    if (!emailDom.current.value.trim()) newErrors.email = true;
    if (!passwordDome.current.value.trim()) newErrors.password = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
        e.preventDefault();
    if (!validateFields()) return;
    setLoading(true)
    try {
      await axios.post("/users/register", {
        username: usernameDome.current.value,
        firstname: firstnameDome.current.value,
        lastname: lastnameDome.current.value,
        email: emailDom.current.value,
        password: passwordDome.current.value,
      });

      navigate("/login");
    } catch (error) {
      const serverMsg = error.response?.data?.msg || "Registration failed";
      console.error("Registration error:", serverMsg);
      setErrors({ server: serverMsg });
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className={classes.Registercontainer}>
      <div className={classes.container}>
        <section className={classes.registration_section}>
          <form className={classes.RegisterForm} onSubmit={handleSubmit}>
            <h3>Join the Network</h3>
            {errors.server && (
              <p className={classes.serverError}>{errors.server}</p>
            )}

            <p>
              Already have an account?
              <Link className={classes.loginLink} to="/login">
                sign in
              </Link>
            </p>
            <input
              className={`${classes.RegisterFormHeader} ${
                errors.username ? classes.error : ""
              }`}
              ref={usernameDome}
              name="username"
              type="text"
              placeholder="Username *"
              autoComplete="username"
            />

            <div className={classes.form_flex}>
              <input
                className={`${classes.RegisterFormHeader} ${
                  errors.firstname ? classes.error : ""
                }`}
                ref={firstnameDome}
                name="firstName"
                type="text"
                placeholder="First name *"
                autoComplete="given-name"
              />

              <input
                className={`${classes.RegisterFormHeader} ${
                  errors.lastname ? classes.error : ""
                }`}
                ref={lastnameDome}
                name="lastName"
                type="text"
                placeholder="Last name *"
                autoComplete="family-name"
              />
            </div>

            <input
              className={`${classes.RegisterFormHeader} ${
                errors.email ? classes.error : ""
              }`}
              ref={emailDom}
              name="email"
              type="email"
              placeholder="Email *"
              autoComplete="email"
            />

            <div className={classes.passwordField}>
              <input
                className={`${classes.RegisterFormHeader} ${
                  errors.password ? classes.error : ""
                }`}
                ref={passwordDome}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                autoComplete="new-password"
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p>
              I agree to the <a href="#">privacy policy</a> and{" "}
              <a href="#">terms of service</a>
            </p>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
            <p>Already have an account?</p>
          </form>
        </section>
      </div>
    </section>
  );
}
export default Register;
