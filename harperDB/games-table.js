const axios = require("axios");

async function createGame(game) {
  console.log("trying to add game to db");

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "insert",
    schema: "games",
    table: "games",
    records: [game],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function updateGame(game) {
  console.log("trying to update game");

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "games",
    table: "games",
    records: [
      {
        id: game.id,
        maker: game.maker,
        name: game.name,
        x: game.x,
        y: game.y,
        scale: game.scale,
        selected: game.selected,
        entities: game.entities,
        tool: game.tool,
        width: game.width,
        height: game.height,
        lines: game.lines,
        players: game.players,
        messages: game.messages,
      },
    ],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function deleteGame(game) {
  console.log("trying to delete game");

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "delete",
    schema: "games",
    table: "games",
    hash_values: [game.id],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function addGameToUser(user, gameId) {
  console.log("trying to add game to user");

  const games = user.games;
  games.push(gameId);

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "users",
    records: [
      {
        id: user.id,
        games,
      },
    ],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function removeGameFromUser(user, game) {
  console.log("trying to remove game from user");
  console.log(game);

  const gameId = game.id;
  const games = user.games.filter((game) => {
    return game !== gameId;
  });

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "users",
    records: [
      {
        id: user.id,
        games,
      },
    ],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function removeUserFromGame(user, game) {
  console.log("trying to remove user from game");

  const userId = user.id;
  let players = game.players;
  delete players[userId];

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "games",
    table: "games",
    records: [
      {
        id: game.id,
        players,
      },
    ],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function findGame(id) {
  console.log("trying to find game");

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const hash_values = [id];

  const data = JSON.stringify({
    operation: "search_by_hash",
    schema: "games",
    table: "games",
    hash_values,
    get_attributes: [
      "id",
      "maker",
      "name",
      "x",
      "y",
      "scale",
      "selected",
      "entities",
      "tool",
      "width",
      "height",
      "lines",
      "players",
      "messages",
    ],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function joinGame(game) {
  console.log("trying to add player to game");

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "games",
    table: "games",
    records: [
      {
        id: game.id,
        players: game.players,
        entities: game.entities,
      },
    ],
  });

  const config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

async function getAllGames(user) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  let sqlString = "(";
  if (user.games.length > 0) {
    for (const game of user.games) {
      sqlString += `'${game}', `;
    }
    sqlString = sqlString.substring(0, sqlString.length - 2);
  } else {
    sqlString += "0";
  }
  sqlString += ")";

  let data = JSON.stringify({
    operation: "sql",
    sql: `SELECT * FROM games.games WHERE id IN ${sqlString}`,
  });

  let config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
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

module.exports = {
  createGame,
  updateGame,
  deleteGame,
  addGameToUser,
  removeGameFromUser,
  removeUserFromGame,
  findGame,
  joinGame,
  getAllGames,
};
