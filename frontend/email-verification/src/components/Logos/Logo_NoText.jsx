import { useNavigate } from "react-router-dom";
import DisboundLogo_NoText from "../../assets/disbound-logo.png";

export default function LogoText() {
  const navigate = useNavigate();
  return (
    <img
      className="logo img-fluid"
      src={DisboundLogo_NoText}
      alt="Disbound Logo"
      onClick={() => navigate("/login")}
      style={{ cursor: "pointer" }}
    />
  );
}
