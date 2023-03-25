const axios = require('axios');

// HarperDB example code
// nosql operations
// insert
// modified to use async/await syntax
async function addMap(map_) {
  console.log('trying to add map to db')

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'insert',
    'schema': 'users',
    'table': 'maps',
    'records': [
      map_
    ],
  });

  const config = {
    method: 'post',
    url: dbUrl,
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: dbPw,
    },
    data : data
  };

  try {
    const response = await axios(config);
    console.log(response.data)
  } catch (error) {
    console.log(error);
  }
}

module.exports = addMap;