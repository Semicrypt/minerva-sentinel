const AppError = require("./AppError");

class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

module.exports = AuthenticationError;