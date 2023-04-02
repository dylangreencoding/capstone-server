const axios = require('axios');

async function createChar(char) {
  console.log('trying to create character in db')

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'insert',
    'schema': 'users',
    'table': 'characters',
    'records': [
      char
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

module.exports = createChar;