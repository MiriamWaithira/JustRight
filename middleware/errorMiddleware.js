// middleware/errorMiddleware.js (Global Error Handler)
/**
 * Handle all errors
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle Multer file size errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    }
  
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
  
    // Default error response
    res.status(500).json({ error: 'Something went wrong!' });
  };
  
  module.exports = errorHandler;