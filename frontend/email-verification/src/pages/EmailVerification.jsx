import { useState, useEffect, useContext } from "react";
// import LogoComponent from "../../components/Logos/LogoComponent";
import LogoComponent from "../../src/components/Logos/LogoComponent";
import BackButton from "../../src/components/buttons/BackButton";
import { CurrentUserContext } from "../../src/App";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../src/components/buttons/SubmitButton";
import { isNumeric } from "validator";

export default function EmailVerificationPage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [count, setCount] = useState(60);
  const [isCounting, setIsCounting] = useState(true);
  const [otpError, setOtpError] = useState("");
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const newInputs = [...inputs];
    // Todo: make this work for copy/paste and backspace
    // If the input is not empty, move to the next input
    if (value && value.length === 1 && /^\d+$/.test(value)) {
      newInputs[index] = value;
      const nextIndex = index + 1;
      if (nextIndex < inputs.length) {
        e.target.form.elements[nextIndex].focus();
      }
    } else {
      newInputs[index] = "";
    }

    setInputs(newInputs);
  };

  useEffect(() => {
    let timer;
    if (count > 0) {
      timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      setIsCounting(false);
    }

    return () => clearTimeout(timer);
  }, [count]);

  const sendEmailOtp = () => {
    if (!isCounting) {
      setCount(60);
      setIsCounting(true);
      fetch("http://localhost:3080/sendEmailOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ email: currentUser?.email }),
      })
        .then((r) => r.json())
        .then((r) => {
          console.assert(r.message === "success");
        });
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setOtpError("");
    let otpBuilder = "";

    console.log("CHECK 1");

    inputs.forEach((val) => {
      otpBuilder += val;
    });

    console.log("CHECK 2");
    console.log("OTP Builder:", otpBuilder); // Debugging OTP builder value

    if (isNumeric(otpBuilder) && otpBuilder.length === 6) {
      fetch("http://localhost:3080/checkEmailOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ email: currentUser?.email, otp: otpBuilder }),
      })
        .then((r) => r.json())
        .then((r) => {
          console.log("Server response:", r);
          if ("success" === r.message) {
            console.log("OTP successfully verified");
            setCurrentUser({ ...currentUser, emailIsVerified: true });
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                ...currentUser,
                emailIsVerified: true,
              })
            );
            console.log("Navigating to /login/MobileVerification");
            navigate("/login/MobileVerification");
          } else {
            setOtpError(r.message);
          }
        })
        .catch((error) => {
          console.error("Error during OTP verification:", error);
        });
    } else {
      setOtpError("Please enter a valid OTP");
    }
  };

  return currentUser ? (
    //
    // IF YOU ARE A USER YOU WILL BE DIRECTED HERE
    //
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      {/* CONTAINER - CONTAINS THE STUFF */}
      <div style={{ "max-width": "30rem" }}>
        {/* LOGO CONTAINER */}
        <div className="mb-4">
          <LogoComponent />
        </div>
        {/* CONTAINER HOLDS THE BACK BUTTON, TEXT, FORM, AND RESEND SPAN */}
        <div className="d-flex flex-column justify-content-center align-items-center text-start gap-2">
          <div className="mb-3">
            {/* BACK BUTTON */}
            <div className="me-auto mb-4">
              <BackButton />
            </div>
            {/* ENTER OTP HEADING */}
            <h3
              className="main-purple fw-bold mb-3"
              style={{ fontSize: "2.4rem" }}
            >
              Enter the One-Time Password
            </h3>
            <p style={{ fontSize: "1.2rem" }}>
              Please enter the OTP that was sent to your Email ID:{" "}
              {currentUser?.email}
            </p>
          </div>
          {/* FORM IS HERE */}
          <form className="" onSubmit={onFormSubmit}>
            <div className="row mb-4">
              {inputs.map((input, index) => (
                <div className="col">
                  <input
                    className="otp-input form-control rounded-3 text-center"
                    key={index}
                    type="text"
                    maxLength="1"
                    value={input}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              ))}
            </div>
            {/* ERROR LABEL */}
            <label for="otp-input" className="errorLabel">
              {otpError}
            </label>
            {/* SUBMIT BUTTON */}
            <div className="d-flex flex-column gap-2">
              <SubmitButton
                className="btn  fw-bold mb-3 bg-main-purple"
                buttonText={"Continue"}
                buttonValue={"submit"}
              />
            </div>
            {/* RESEND OTP TEXT CONTAINER */}
            <div className="text-end mt-3 main-purple">
              <span
                onClick={sendEmailOtp}
                className="d-block mobile-text"
                id="resend"
                style={{ fontSize: "1.2rem" }}
              >
                {count > 0 ? `Resend in ${count} secs` : "Resend OTP"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    //
    // IF YOU ARE NOT A USER YOU WILL BE DIRECTED HERE
    //
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      {/* LOGO CONTAINER */}
      <div className="mb-4">
        <LogoComponent />
      </div>
      <div className="container d-flex flex-column justify-content-center align-items-center text-center gap-2 mt-2">
        <div className="mb-3 d-flex align-items-center justify-content-center gap-3">
          <BackButton />
          <p>You are not logged in</p>
        </div>
      </div>
    </div>
  );
}
