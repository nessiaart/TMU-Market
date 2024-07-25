import React, { Component } from 'react'
//import './signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './tmulogodark.png'

export default class SignUp extends Component {
  constructor(props){ //retrieve submitted values using states
    super (props)
    this.state={
        fname:"",
        lname:"",
        email:"",
        password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e){ //submit function
    e.preventDefault(); //prevent default submission
    const { fname, lname, email, password } = this.state;
    console.log(fname, lname, email, password)
    fetch("http://localhost:3001/register", { //fetch information from the server
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept:'application/json',
        
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        password
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userRegister");
      if (data.status === "ok") {
        alert("Account creation successful");
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);
        // Redirect to the dashboard or login page
        window.location.href = "./dashboard";
      } else {
        // Handle errors or show messages to the user
        alert(data.error || "An error occurred");
      }
    })  
  }  
  render() {
    return (
      <div className="container mt-4">
        <section className="sign-up">
          <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
            <div className="row gx-lg-5 align-items-center mb-5">

              
                <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                <div className='img-text2' style={{marginLeft:'10px'}}>
                <img className= "img1" src={logo} alt="TMU"style={{width:450, height:'auto'}}/>
                </div>
                <h1 className="my-4 display-6 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 93%)' }}>
                  Welcome to <br />
                  <span style={{ color: 'hsl(218, 81%, 75%)' }}>TMU Market</span>
                </h1>
                <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
                  
                </p>
              </div>

              {/* Login Form */}
              <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                <div className="forms1">
                  <div className="card bg-glass">
                    <div className="card-body px-4 py-5 px-md-5">
                      <form onSubmit={this.handleSubmit}>
                        
                        <h3 className="mb-3 h3" style={{ fontWeight: '600' }}>Sign Up</h3>
                        
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form3Example1"
                            className="form-control"
                            onChange={e => this.setState({ fname: e.target.value })}
                            required
                          />
                          <label className="form-label" htmlFor="form3Example1" style={{ fontSize: '18px' }}>First Name</label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form3Example2"
                            className="form-control"
                            onChange={e => this.setState({ lname: e.target.value })}
                            required
                          />
                          <label className="form-label" htmlFor="form3Example2" style={{ fontSize: '18px' }}>Last Name</label>
                        </div>

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
                        
                        <button type="submit" className="btn btn-primary  mb-4">
                          Sign Up
                        </button>
                        
                        <p className="forgot-password text-center"> 
                        Already have an account? <a href="/sign-in"> Sign in? </a>
                        </p>
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
