import axios from 'axios';
import express from 'express';
import * as routes from "./routes";
import * as discovery from "./discovery";

// ---------------------
// TESTING WITH CURL:
//
// curl -X PUT -H "Content-Type: application/json" -d '{"on":true, "brightness":20, "temperature": 240}' http://localhost:3000
// ----------------------

// Lights are discovered via multicast DNS (type: _elg._tcp.local)

// ELGATO API
//
// baseUrl example = http://192.168.0.245:9123
//
// POST ${baseUrl}/elgato/identify --> blink light
// GET/PUT ${baseUrl}/elgato/lights --> control light
// GET/PUT ${baseUrl}/elgato/lights/settings --> read/update lights settings
// GET/PUT ${baseUrl}/elgato/accessory-info --> read/udpate info

const app = express();
const port = 3000;

// make sure we understand json
app.use(express.json());

// Configure routes
routes.register( app );

// Discover nodes
discovery.register( app );

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
