import React, { Component } from 'react';
import './logout.css';

export default class Home extends Component {
  constructor(props){ 
    super (props);
    this.state={
        userData:"",
    };
  }
  componentDidMount(){
    fetch("http://localhost:3001/dashboard", { 
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept:'application/json',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token")
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userData");
      this.setState({ userData: data.data });
    });  
  }
  logOut=() => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  
  render() {
    return (
      <div>
        <br /><br /><br /><br />
        <p>Thank you for shopping with TMU market!</p>
        <p>Hope to see you soon  {this.state.userData.fname} :)</p>
        <br />
        
        <button onClick={this.logOut}> Logout </button>
      </div>
    );
  }
}




