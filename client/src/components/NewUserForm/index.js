// User Login input /newuser

// Name, Address, Username, Password, Income, Date of Birth, Race, Ethnicity

import React, { useState, useEffect } from 'react';
// import { Row, Input, Button } from 'react-materialize';
import { Form, Button } from 'semantic-ui-react';
import Auth from '../../utils/Auth'
import './style.css';

// Rewrite as Class with State passing using ID and Handler with calls /api/needs/ POST request

const NewUserForm = props => {

  const [newUserInfo, setNewUserInfo] = useState();

  const handleInputChange = event => {
    const { name, value } = event.target;
    console.log(newUserInfo);
    setNewUserInfo({
      ...newUserInfo,
      [name]: value
    });
  }

  const handleNewUserSubmit = event => {
    event.preventDefault();
    const SignUpInfo = newUserInfo;
    console.log(SignUpInfo);
    if (newUserInfo.password) {
      // console.log(event);
      console.log(SignUpInfo);
      Auth.signup({
        email: SignUpInfo.email,
        password: SignUpInfo.password,
        firstName: SignUpInfo.firstName,
        lastName: SignUpInfo.lastName,
      })
        .then(res => {
          window.location = res.data.redirect;
        })
        .catch(err => {
          if (err.response.data.error) {
            // Todo Show the flash message
            //I'll change this to react side flash instead of a window alert
            alert(err.response.data.error);
          }
        });
    } else {
      return console.log('please confirm password');
    }
  }


  return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Field
            name='firstName'
            label='First Name'
            control='input'
            onChange={handleInputChange}
            required
          />
          <Form.Field
            name='lastName'
            label='Last Name'
            control='input'
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field
            name='email'
            label='Email'
            control='input'
            type='email'
            onChange={handleInputChange}
            required
          />
          <Form.Field
            name='password'
            label='Password'
            control='input'
            type='password'
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button 
          type='submit'
          basic
          color='blue'
          style={{
            margin: '10px',
            float: 'right',
            height: '50px'}}
          onClick={handleNewUserSubmit}
        > 
         Create New User
        </Button>
      </Form>
  );
}

export default NewUserForm;
