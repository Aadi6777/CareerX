const app = require('./app');
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 CareerX Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const ALT_PORT = 5002;
    console.log(`Port ${PORT} in use, starting on http://localhost:${ALT_PORT}`);
    app.listen(ALT_PORT);
  }
});
