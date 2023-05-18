const axios = require("axios");

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

module.exports = updateGame;
