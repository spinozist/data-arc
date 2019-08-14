import React, { useState, useEffect } from 'react';
// import { Row, Input, Button } from 'react-materialize';
import { Form, Button } from 'semantic-ui-react';
import Auth from '../../utils/Auth'
import './style.css';
import API from '../../utils/API';
// import API from '../../utils/API';

// Rewrite as Class with State passing using ID and Handler with calls /api/needs/ POST request

const NewUserForm = props => {

  const [newUserInfo, setNewUserInfo] = useState();

  const handleInputChange = event => {
    const { name, value } = event.target;
    // console.log(newUserInfo);
    setNewUserInfo({
      ...newUserInfo,
      [name]: value
    });
  }

  const handleNewUserSubmit = event => {
    event.preventDefault();
    // console.log(newUserInfo);
    newUserInfo ?
    newUserInfo.password && newUserInfo.email ? 
      // console.log(event);
      // console.log(newUserInfo);
      Auth.signup({
        email: newUserInfo.email,
        password: newUserInfo.password,
        firstName: newUserInfo.firstName,
        lastName: newUserInfo.lastName,
      })
      .then(res => {
        // setNewUserInfo();
        console.log('Result of NEW USER SUBMIT ');
        console.log(res);

        // Auth.login({
        //   email: res.config.data.email,
        //   password: res.config.data.password
        // })
      })
      .catch(err => 
        err ? console.log(err) : null) 

    : console.log('No password and/or email entered')
    : console.log('Nothing entered!');
  }

  // useEffect(null, newUserInfo);


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
