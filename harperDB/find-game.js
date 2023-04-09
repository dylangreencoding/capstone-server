const axios = require('axios');

// from HarperDB <example code>
// nosql operations
// search by value
// modified to use async/await syntax
async function findGame (id) {

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const hash_values = [id];

  const data = JSON.stringify({
    'operation' : 'search_by_hash',
    'schema' : 'users',
    'table' : 'games',
    hash_values,
    'get_attributes' : [
      'id',
      'maker',
      'name',
      'x',
      'y',
      'scale',
      'selected',
      'selectFrom',
      'tool',
      'width',
      'height',
      'lines',
      'players',
      'messages'
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

module.exports = findGame;