import React, { Component } from 'react'
import './login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './tmulogodark.png'

export default class Login extends Component {
  constructor(props){ 
    super (props)
    this.state={
        email:"",
        password: "",
        error: "", // Add an error field in the state
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    const { email, password } = this.state;
    console.log(email, password);
    fetch("http://localhost:3001/login", { 
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept:'application/json',
        
      },
      body: JSON.stringify({
        email,
        password
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userLogin");
      if (data.status === "ok") {
        alert("login successful");
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);

        //Admin
        // Check if the user is an admin
      if (email === 'TmuMarketplace@gmail.com') {
        // Redirect to admin page
        window.location.href = "./adminhome";
      } else {
        //end
        window.location.href = "./dashboard"
      }}
      else {
        // Set error message from the response, or a default one if not provided
        this.setState({ error: data.error || "Username or Password is incorrect" });
      }
    })
    .catch((error) => {
      // Handle fetch errors
      this.setState({ error: "An error occurred. Please try again." });
    });  
  }
  render() {
    const { error } = this.state;
    return (
      <div className="container mt-4">
        <section className="login">
          <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
            <div className="row gx-lg-5 align-items-center mb-5">
              
             
              <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                <div className='img-text'>
              <img className='img2'src={logo} alt="tmulogo" />
              </div>
                <h1 className="my-4 display-6 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 93%)' }}>
                  Welcome to <br />
                  <span style={{ color: 'hsl(218, 81%, 75%)' }}>TMU Market</span>
                </h1>
                
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                <div className="forms2">
                  <div className="card bg-glass">
                    <div className="card-body px-4 py-5 px-md-5">
                      <form onSubmit={this.handleSubmit}>
                        <div className="row">
                        {error && (
                          <div className="alert alert-danger">
                            <strong>{error}</strong>
                          </div>
                        )}
                        </div>
                        <h3 className="mb-3 h3" style={{ fontWeight: '600' }}>Sign In</h3>
                        
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form3Example3"
                            className="form-control"
                            onChange={e => this.setState({ email: e.target.value })}
                            required
                          />
                          <label className="form-label" htmlFor="form3Example3" style={{ fontSize: '18px' }}>Email address</label>

                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form3Example4"
                            className="form-control"
                            onChange={e => this.setState({ password: e.target.value })}
                            required
                          />
                          <label className="form-label" htmlFor="form3Example4" style={{ fontSize: '18px' }}>Password</label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-4">
                          Sign In
                        </button>
                        
                        <div className="text-center">
                          <p style={{ fontSize: '18px' }}>Don't have an account yet? <a href="/sign-up"> Sign Up</a></p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    )
  }
}

