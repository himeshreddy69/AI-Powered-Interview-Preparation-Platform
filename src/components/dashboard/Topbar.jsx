import "../../assets/styles/Topbar.css";

function Topbar({ user }) {

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0]?.split(/[._\d]/)[0] ||
    "User";

  return (

    <header className="topbar">

      <div>

        <h1>Dashboard</h1>

        <p>
          Welcome back, <strong>{displayName}</strong>
        </p>

      </div>

      <div className="topbar-profile">

        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
        />

      </div>

    </header>

  );

}

export default Topbar;