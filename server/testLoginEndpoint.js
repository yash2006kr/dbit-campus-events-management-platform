const axios = require('axios');

const testLoginEndpoints = async () => {
  try {
    console.log('Testing User Login...');
    const userLogin = await axios.post('http://localhost:5000/api/users/login', {
      email: 'john.doe@dbit.edu',
      password: 'student123'
    });
    console.log('User Login Success:', userLogin.data);

    console.log('\nTesting Admin Login...');
    const adminLogin = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@dbit.edu',
      password: 'admin123'
    });
    console.log('Admin Login Success:', adminLogin.data);

    console.log('\nTesting User Registration...');
    const userRegister = await axios.post('http://localhost:5000/api/users/register', {
      name: 'Test User',
      email: 'test@dbit.edu',
      password: 'test123'
    });
    console.log('User Registration Success:', userRegister.data);

  } catch (error) {
    console.error('Error testing login endpoints:', error.response?.data || error.message);
  }
};

testLoginEndpoints();
