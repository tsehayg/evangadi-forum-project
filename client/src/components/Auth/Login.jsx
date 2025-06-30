import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AppState } from "../../App";

function Login() {
  const [errors, setErrors] = useState({});
  // Access login function from context
  const { login, IsLoggedIn, loading } = useContext(AppState);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Initializes the navigate function
  const navigate = useNavigate();
  //Creates a reference to the email and Password input field and allowing you to access its value directly.
  const userEmail = useRef();
  const userPassword = useRef();
  useEffect(() => {
    if (IsLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [IsLoggedIn]);
  //handle form submission.
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const userEmailValue = userEmail.current.value;
    const userPasswordValue = userPassword.current.value;
    let hasError = false;
    const newError = {};
    if (!userEmailValue && !userPasswordValue) {
      newError.all = "Please provide all required filds";
      hasError = true;
    }
    if (!userEmailValue) {
      newError.email = "Please provide required email";
      hasError = true;
    }
    if (!userPasswordValue) {
      newError.password = "Please provide  required password";
      hasError = true;
    }
    if (hasError) {
      setErrors(newError);
      return;
    }

    try {
      await login({
        email: userEmailValue,
        password: userPasswordValue,
      });
    } catch (error) {
      const message =
        error?.response?.data?.msg ||
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      setErrors({ general: message });
    }
  }

  return (
    <>
      <br />
      <section className={style.loginContainer}>
        <div className="container px-md-5">
          <div className="row">
            <div className="col-12  shadow auth mx-md-4 my-md-5">
              <div className={style.login_inner}>
                <div className={style.Carousel_inner}>
                  <div className="carousel-item active">
                    <h3>Login to your account</h3>
                    <div>
                      Don't have an account?
                      <span>
                        <Link to={"/register"}> Create a new account</Link>
                      </span>
                    </div>
                    {/* error happen on input fileds */}
                    {errors && Object.values(errors).length > 0 && (
                      <div className={style.server_error}>
                        <div>{Object.values(errors)[0]}</div>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className={style.form}>
                      <div
                        className={
                          errors.email ? style.error_input : style.from_input
                        }
                      >
                        <input
                          type="email"
                          placeholder="Email"
                          ref={userEmail}
                        />
                        <span className={style.line}></span>
                      </div>
                      <br />
                      <div
                        className={
                          errors.password ? style.error_input : style.from_input
                        }
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          ref={userPassword}
                        />
                        <span className={style.line}></span>
                        <span
                          className={
                            errors.password
                              ? style.password_toggle_error
                              : style.password_toggle
                          }
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </span>
                      </div>
                      <div className={style.forget}>
                        <Link to={"/login"}>Forgot password</Link>
                      </div>
                      <div className={style.btn}>
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
                              Logging in...
                            </>
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Login;
