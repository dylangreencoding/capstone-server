// ENDWARE FOR /char ROUTE

const {
  createChar,
  updateChar,
  deleteChar,
} = require("../harperDB/characters-table");

const saveChar = async (request, response) => {
  try {
    if (request.user) {
      if (request.body.id === "") {
        await createChar(request.body);
      } else {
        await updateChar(request.body);
      }

      return response.status(200).json({
        message: "Character saved successfully @ char/save",
        type: "200 OK",
        char: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: "You are not logged in @ char/save",
      type: "500 Internal Server Error",
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error getting protected route @ char/save",
      error,
    });
  }
};

const deleteExistingChar = async (request, response) => {
  try {
    if (request.user) {
      await deleteChar(request.body);

      return response.status(200).json({
        message: "Character deleted successfully @ char/delete",
        type: "200 OK",
        char: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: "You are not logged in @ char/delete",
      type: "500 Internal Server Error",
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error getting protected route @ char/delete",
      error,
    });
  }
};

module.exports = { saveChar, deleteExistingChar };
