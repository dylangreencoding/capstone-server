const axios = require('axios');

async function removeUserFromGame(user, game) {
  console.log('trying to remove user from game')
  
  const userId = user.id;
  let players = game.players;
  delete players[userId];

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'update',
    'schema': 'games',
    'table': 'games',
    'records': [
      {
        'id': game.id,
        players
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
    return response.data
  } catch (error) {
    console.log(error);
  }
}

module.exports = removeUserFromGame;