const http = require('http');

const makeRequest = (data, endpoint) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

const testLogin = async () => {
  try {
    console.log('Testing User Login...');
    const userResult = await makeRequest({
      email: 'john.doe@dbit.edu',
      password: 'student123'
    }, '/api/users/login');
    console.log('User Login Result:', userResult);

    console.log('\nTesting Admin Login...');
    const adminResult = await makeRequest({
      email: 'admin@dbit.edu',
      password: 'admin123'
    }, '/api/admin/login');
    console.log('Admin Login Result:', adminResult);

    console.log('\nTesting User Registration...');
    const registerResult = await makeRequest({
      name: 'Test User',
      email: 'test@dbit.edu',
      password: 'test123'
    }, '/api/users/register');
    console.log('Registration Result:', registerResult);

  } catch (error) {
    console.error('Error:', error.message);
  }
};

testLogin();
