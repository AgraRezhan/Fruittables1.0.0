import "../Login/loginRegister.css";
const index = () => {
  return (
    <>
      <div className="body-loginreg">
        <div className="login-container">
          <h2 className="text-center" style={{ color: "#28a745" }}>
            Register
          </h2>
          <form>
            <div className="mb-3">
              <label for="new-first-name" className="form-label">
                First Name :
              </label>
              <input
                type="text"
                className="form-control"
                id="new-first-name"
                name="new-first-name"
                required
              />
            </div>
            <div className="mb-3">
              <label for="new-last-name" className="form-label">
                Last name:
              </label>
              <input
                type="text"
                className="form-control"
                id="new-last-name"
                name="new-last-name"
                required
              />
            </div>
            <div className="mb-3">
              <label for="new-username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                id="new-username"
                name="new-username"
                required
              />
            </div>{" "}
            <div className="mb-3">
              <label for="new-email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="new-email"
                name="new-email"
                required
              />
            </div>
            <div className="mb-3">
              <label for="new-password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="new-password"
                name="new-password"
                required
              />
            </div>
            {/* <div className="mb-3">
              <label for="confirm-password" className="form-label">
                Confirm Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="confirm-password"
                name="confirm-password"
                required
              />
            </div> */}
            <div class="mb-3">
              <label for="new-select" className="form-label">
                Role :
              </label>
              <select class="form-select" id="inputGroupSelect01">
                <option selected>Choose...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <div className="login-link">
              <a href="login.html">Sudah punya akun? Login</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;
