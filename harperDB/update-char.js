const axios = require('axios');

async function updateChar(char) {
  console.log('trying to update character')

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'update',
    'schema': 'users',
    'table': 'characters',
    'records': [
      {
        'id': char.id,
        'maker': char.maker,
        'name': char.name,
        'x': char.x,
        'y': char.y,
        'level': char.level,
      }
    ]
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

module.exports = updateChar;