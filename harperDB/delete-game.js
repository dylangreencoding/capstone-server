const axios = require('axios');

async function deleteGame(game) {
  console.log('trying to delete game')
  console.log(game.id)

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'delete',
    'schema': 'users',
    'table': 'games',
    'hash_values': [
        game.id,
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
    return response.data
  } catch (error) {
    console.log(error);
  }
}

module.exports = deleteGame;