const axios = require('axios');

async function removeGameFromUser(user, game) {
  console.log('trying to remove game from user')
  
  const gameId = game.id
  const games = user.games.filter((game) => {
    return game != gameId;
  });

  // const gameId = game.id
  // let games = []
  // for (const game of user.games) {
  //   if (game !== gameId) {
  //     games.push(game);
  //   }
  // }

  console.log(games)

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'update',
    'schema': 'users',
    'table': 'users',
    'records': [
      {
        'id': user.id,
        games
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

module.exports = removeGameFromUser;