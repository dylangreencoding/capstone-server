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

      return response.json({
        message: 'capstone-server/char/save: "Character saved successfully"',
        type: "success",
        char: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/char/save: "You are not logged in"',
      type: "error",
    });
  } catch (error) {
    response.status(500).json({
      type: "error",
      message: 'capstone-server/char/save: "Error getting protected route"',
      error,
    });
  }
};

const deleteExistingChar = async (request, response) => {
  try {
    if (request.user) {
      await deleteChar(request.body);

      return response.json({
        message:
          'capstone-server/char/delete: "Character deleted successfully"',
        type: "success",
        char: request.body,
      });
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/char/delete: "You are not logged in"',
      type: "error",
    });
  } catch (error) {
    response.status(500).json({
      type: "error",
      message: 'capstone-server/char/delete: "Error getting protected route"',
      error,
    });
  }
};

module.exports = { saveChar, deleteExistingChar };
