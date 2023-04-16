const axios = require('axios');

// from HarperDB <example code>
// nosql operations
// search by value
// modified to use async/await syntax
async function searchUsers (email) {
  console.log('searching users')

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const search_value = email;

  const data = JSON.stringify({
    'operation' : 'search_by_value',
    'schema' : 'users',
    'table' : 'users',
    'search_attribute' : 'email',
    search_value,
    'get_attributes' : ['*'],
  });

  const config = {
    method : 'post',
    url : dbUrl,
    headers : { 
      'Content-Type' : 'application/json', 
      Authorization : dbPw,
    },
    data : data
  };


  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
  }

}

module.exports = searchUsers;