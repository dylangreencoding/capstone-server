const axios = require('axios');

async function addRefresh(id, refresh_token) {
  console.log('trying to add refresh token', id, refresh_token)


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
        'refresh_token': refresh_token,
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

module.exports = addRefresh;