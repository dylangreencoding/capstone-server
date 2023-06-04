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

      return response.json({
        message: 'capstone-server/map/save: "Map saved successfully"',
        type: "success",
        map: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/map/save: "You are not logged in"',
      type: "error",
    });
  } catch (error) {
    response.status(500).json({
      type: "error",
      message: 'capstone-server/map/save: "Error getting protected route"',
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
