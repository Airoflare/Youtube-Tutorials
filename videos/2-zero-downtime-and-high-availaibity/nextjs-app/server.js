const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  // Handle SIGTERM for graceful shutdown with 25s delay
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down in 25s');
  
    // Start a 25-second timer before shutting down
    // During this window:
    //   - Existing in-flight requests continue to be processed
    //   - Load balancer stops sending new traffic because /api/health returns 503
    setTimeout(() => {
      console.log('Closing server after delay');
  
      // Any new incoming requests after 25 secs will be refused
      server.close(() => {
        console.log('Server closed, exiting');
  
        // Exit the process successfully
        process.exit(0);
      });
  
      // Note: If there are still open connections after some timeout, Node will keep them alive.
    }, 25000); // 25-second graceful shutdown window
  });


  // Handle SIGINT
  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down immediately');

    // Close the server and then exit
    server.close(() => {
      process.exit(0); 
    });
  });
});
