const axios = require('axios');

async function updateMap(map) {
  console.log('trying to update map')

  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const data = JSON.stringify({
    'operation': 'update',
    'schema': 'users',
    'table': 'maps',
    'records': [
      {
        'id': map.id,
        'maker': map.maker,
        'name': map.name,
        'x': map.x,
        'y': map.y,
        'scale': map.scale,
        'selected': map.selected,
        'tool': map.tool,
        'width': map.width,
        'height': map.height,
        'walls': map.walls,
        'zombies': map.zombies,
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

module.exports = updateMap;