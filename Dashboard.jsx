import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Protected Dashboard</h2>

        <h3>Welcome, {user?.name}</h3>

        <p>Email: {user?.email}</p>

        <p>This page is protected using JWT Token.</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;