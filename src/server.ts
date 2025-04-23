import app from  './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // swagger url 
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});


export default server;