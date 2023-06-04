// END-WARE FOR /map ROUTES

const { createMap, updateMap, deleteMap } = require("../harperDB/maps-table");

const saveMap = async (request, response) => {
  try {
    if (request.user) {
      if (request.body.id === "") {
        await createMap(request.body);
      } else {
        await updateMap(request.body);
      }

      return response.status(200).json({
        message: "Map saved successfully @ map/save",
        type: "200 OK",
        map: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: "You are not logged in @ map/save",
      type: "500 Internal Server Error",
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error getting protected route @ map/save",
      error,
    });
  }
};

const deleteExistingMap = async (request, response) => {
  try {
    if (request.user) {
      await deleteMap(request.body);

      return response.json({
        message: 'capstone-server/map/delete: "Map deleted successfully"',
        type: "success",
        map: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/map/delete: "You are not logged in"',
      type: "error",
    });
  } catch (error) {
    response.status(500).json({
      type: "error",
      message: 'capstone-server/map/delete: "Error getting protected route"',
      error,
    });
  }
};

module.exports = { saveMap, deleteExistingMap };
