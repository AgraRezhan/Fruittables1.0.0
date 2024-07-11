import "./loginRegister.css"
const index = () => {

    return (
        <>
    <div className="body-loginreg">
    <div className="login-container">
      <h2 className="text-center" style={{color: "#28a745"}}>Login</h2>
      <form>
        <div className="mb-3">
          <label for="username" className="form-label">Username:</label>
          <input type="text" className="form-control" id="username" name="username" required />
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" name="password" required />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
        <div className="register-link">
          <a href="register.html">Belum punya akun? Daftar</a>
        </div>
        <div className="social-buttons">
          <button type="button" className="btn btn-google btn-social"><i className="fab fa-google"></i></button>
          <button type="button" className="btn btn-facebook btn-social"><i className="fab fa-facebook-f"></i></button>
        </div>
      </form>
    </div>
    </div>
        </>
    )
}

export default index;