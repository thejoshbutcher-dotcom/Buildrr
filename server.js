// Root entry point. Many Node hosts (incl. Hostinger's default) look for
// `server.js` at the repo root. The real Express app lives in server/index.js;
// importing it starts the server (it calls app.listen on load).
import './server/index.js'
