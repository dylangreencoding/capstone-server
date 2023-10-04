const axios = require("axios");

async function createMap(map) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "insert",
    schema: "users",
    table: "maps",
    records: [map],
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

async function updateMap(map) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "maps",
    records: [
      {
        id: map.id,
        maker: map.maker,
        name: map.name,
        x: map.x,
        y: map.y,
        scale: map.scale,
        selected: map.selected,
        entities: map.entities,
        tool: map.tool,
        width: map.width,
        height: map.height,
        lines: map.lines,
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

async function deleteMap(map) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "delete",
    schema: "users",
    table: "maps",
    hash_values: [map.id],
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

async function getAllMaps(userId) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  let data = JSON.stringify({
    operation: "sql",
    sql: `SELECT * FROM users.maps WHERE maker = '${userId}'`,
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

module.exports = { createMap, updateMap, deleteMap, getAllMaps };
