const axios = require('axios');

async function updatePassword(id, passwordHash) {
  console.log('trying to updatePassword', id, passwordHash)


  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'update',
    'schema': 'users',
    'table': 'users',
    'records': [
      {
        'id': id,
        'password': passwordHash,
      }
    ]
  });

  const config = {
    method: 'post',
    url: 'https://chat-tabletop.harperdbcloud.com',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Basic ZHlsYW5ncmVlbmNvZGluZzpTcGVjaWFsSzkh'
    },
    data : data
  };

  try {
    const response = await axios(config);
    return response.data
  } catch (error) {
    console.log(error);
  }
}

module.exports = updatePassword;