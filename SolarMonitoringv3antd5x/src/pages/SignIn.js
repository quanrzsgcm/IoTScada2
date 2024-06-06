import React, { useState, useContext } from 'react';
import '../assets/styles/SignIn.scss';
import Logo from '../assets/images/01_logobachkhoatoi2.png';
import { Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function SignIn() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  });
  const handleChangeUserInfo = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };
  const [form] = Form.useForm();

  let {loginUser} = useContext(AuthContext)

  const handleLogin = () => {
    const e = {
      email: userInfo.username,
      password: userInfo.password
    }
    console.log(e.email);
    
    loginUser(e);
  };

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8000/api/token/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: userInfo.username,
  //         password: userInfo.password,
  //       }),
  //     });

  //     if (response.ok) {
  //       // Handle successful login, e.g., redirect to another page
  //       console.log('Login successful');
  //     } else {
  //       // Handle login failure
  //       console.error('Login failed');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred during login:', error);
  //   }
  // };
  return (
    <div className='sign-in'>
      <div className='sign-in-form'>
        <img src={Logo} alt='logo' className='logo' />
        <div className='title'>Login</div>
        <Form
          id='signin_form'
          autoComplete='off'
          // onFinish={handleSubmit}
          form={form}
          className='form-container'
          initialValues={{
            agreement: true,
          }}
        >
          <div>
            <label className='form-label'>Username</label>
            <Form.Item
              name='username'
              rules={[
                {
                  required: true,
                  message: 'Please fill out this field',
                },
              ]}
              className='form-item'
            >
              <Input
                className='form-input'
                value={userInfo.username}
                onChange={(e) =>
                  handleChangeUserInfo('username', e.target.value)
                }
              />
            </Form.Item>
          </div>
          <div>
            <label className='form-label'>Password</label>
            <Form.Item
              name='password'
              className='form-item'
              rules={[
                {
                  required: true,
                  message: 'Please fill out this field',
                },
              ]}
            >
              <Input.Password
                className='form-input'
                value={userInfo.password}
                onChange={(e) =>
                  handleChangeUserInfo('password', e.target.value)
                }
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name='agreement'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
            >
              <Checkbox defaultChecked>
                I have read and agreed to the <a href='#'>User Agreement</a> and{' '}
                <a href='#'>Privacy Policy</a>
              </Checkbox>
            </Form.Item>
          </div>
          <button
            className='btn-primary btn-submit'
            type='submit'
            form='signin_form'
            onClick={handleLogin}
          >
            Login
          </button>
          <div className='forgot-password-section'>
            <Link to={'/forgot-password'} className='forgot-password-link'>
              Forgot Password
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
