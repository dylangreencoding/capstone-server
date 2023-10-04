const axios = require("axios");

async function createChar(char) {

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "insert",
    schema: "users",
    table: "characters",
    records: [char],
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
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function updateChar(char) {

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "characters",
    records: [
      {
        id: char.id,
        maker: char.maker,
        name: char.name,
        x: char.x,
        y: char.y,
        level: char.level,
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
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function deleteChar(char) {

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "delete",
    schema: "users",
    table: "characters",
    hash_values: [char.id],
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
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function getAllChars(userId) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  let data = JSON.stringify({
    operation: "sql",
    sql: `SELECT * FROM users.characters WHERE maker = '${userId}'`,
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

module.exports = { createChar, updateChar, deleteChar, getAllChars };
