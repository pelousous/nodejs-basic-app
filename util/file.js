const fs = require("fs");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log("successfully deleted " + filePath);
  });
};

exports.deleteFile = deleteFile;
