import "./App.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// LOGIN PAGES
import EmailVerificationPage from "./pages/EmailVerification.jsx";

// LAYOUTS
import LoginLayout from "./layouts/LoginLayout";

// ERROR PAGE
import ErrorPage from "./pages/ErrorPage";

export const CurrentUserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedUserObject = storedUser ? JSON.parse(storedUser) : null;
    // If the token/email does not exist
    if (!storedUserObject?.token || !storedUserObject?.email) {
      if (!currentUser?.token || !currentUser?.email) {
        return;
      }
    }
    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://localhost:3080/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: "test" }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }, [currentUser]);

  function ErrorBoundary() {
    let error = useRouteError();
    console.error(error);

    return <ErrorPage />;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* LOGIN PAGE ROUTES */}
        <Route
          path="/login"
          element={<LoginLayout />}
          errorElement={<ErrorBoundary />}
        >
          <Route
            path="/login/emailverification"
            element={<EmailVerificationPage />}
          />
        </Route>
      </>
    )
  );

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
