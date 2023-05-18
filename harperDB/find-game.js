const axios = require("axios");

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

module.exports = findGame;
