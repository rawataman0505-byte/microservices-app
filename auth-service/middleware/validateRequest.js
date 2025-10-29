const { ZodError } = require("zod");


exports.validateSignup = (req, res, next) => {
  try {
    const parsedData = signupSchema.parse(req.body);
    req.body = parsedData;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return res.status(400).json({
        status: "fail",
        message: "Signup validation failed",
        errors,
      });
    }

    // Pass other unexpected errors to global error handler
    return next(err);
  }
};


exports.validateLogin = (req, res, next) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    req.body = parsedData;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return res.status(400).json({
        status: "fail",
        message: "Login validation failed",
        errors,
      });
    }

    next(err);
  }
};