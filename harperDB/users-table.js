const axios = require("axios");

async function searchUsers(email) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const search_value = email;

  const data = JSON.stringify({
    operation: "search_by_value",
    schema: "users",
    table: "users",
    search_attribute: "email",
    search_value,
    get_attributes: ["*"],
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
    console.log("WTF???");
  }
}

async function addUser(name, birthYear, email, password, validationCode) {
  console.log("trying to add user");

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "insert",
    schema: "users",
    table: "users",
    records: [
      {
        name,
        birthYear,
        email,
        password,
        refresh_token: "",
        games: [],
        validationCode,
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

async function findById(id) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const hash_values = [id];

  const data = JSON.stringify({
    operation: "search_by_hash",
    schema: "users",
    table: "users",
    hash_values,
    get_attributes: [
      "name",
      "birthYear",
      "email",
      "password",
      "id",
      "refresh_token",
      "validationCode",
      "games",
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

async function addRefresh(id, refresh_token) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "users",
    records: [
      {
        id: id,
        refresh_token: refresh_token,
      },
    ],
  });

  const config = {
    method: "post",
    url: "https://chat-tabletop.harperdbcloud.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic ZHlsYW5ncmVlbmNvZGluZzpTcGVjaWFsSzkh",
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

async function updateValidationCode(id, code) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "users",
    records: [
      {
        id: id,
        validationCode: code,
      },
    ],
  });

  const config = {
    method: "post",
    url: "https://chat-tabletop.harperdbcloud.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic ZHlsYW5ncmVlbmNvZGluZzpTcGVjaWFsSzkh",
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

async function updatePassword(id, passwordHash) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    operation: "update",
    schema: "users",
    table: "users",
    records: [
      {
        id: id,
        password: passwordHash,
      },
    ],
  });

  const config = {
    method: "post",
    url: "https://chat-tabletop.harperdbcloud.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic ZHlsYW5ncmVlbmNvZGluZzpTcGVjaWFsSzkh",
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
  searchUsers,
  addUser,
  findById,
  addRefresh,
  updateValidationCode,
  updatePassword,
};
