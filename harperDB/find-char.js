const axios = require('axios');
// UNUSED 5/1/2023

async function findChar (id) {
  console.log('trying to find character')

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const hash_values = [id];

  const data = JSON.stringify({
    'operation' : 'search_by_hash',
    'schema' : 'user',
    'table' : 'maps',
    hash_values,
    'get_attributes' : [
      'id',
      'maker',
  ]
  });

  const config = {
    method : 'post',
    url : dbUrl,
    headers : { 
      'Content-Type' : 'application/json', 
      Authorization : dbPw,
    },
    data : data
  };


  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
  }

}

module.exports = findChar;