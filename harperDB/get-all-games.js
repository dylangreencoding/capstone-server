const axios = require('axios');

async function getAllGames(user) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  let sqlString = '(';
  if (user.games.length > 0) {
    for (const game of user.games) {
      sqlString += `'${game}', `
    }
    sqlString = sqlString.substring(0, sqlString.length - 2);
  }
  sqlString += ')';
  console.log(sqlString)

  let data = JSON.stringify({
    operation: 'sql',
    // sql: `SELECT * FROM users.games WHERE maker = '${user.id}'`,
    sql: `SELECT * FROM users.games WHERE id IN ${sqlString}`,
  });

  let config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: dbPw,
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
  }

}

module.exports = getAllGames;