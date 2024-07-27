import disboundLogo from "../../assets/disbound-logo.png";
import { useNavigate } from "react-router-dom";

export default function LogoComponent() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
      <img
        className="logo img-fluid"
        src={disboundLogo}
        alt="Disbound Logo"
        onClick={() => navigate("/login")}
        style={{ cursor: "pointer" }}
      />
      <h1
        className="text-uppercase disbound-text"
        style={{ fontSize: "2.4rem", marginBottom: "2.4rem" }}
      >
        Disbound
      </h1>
    </div>
  );
}
