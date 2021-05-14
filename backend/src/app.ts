import express from "express";
import * as discovery from "./discovery";
import * as routes from "./routes";

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
// Blink light                 -->  POST    ${baseUrl}/elgato/identify
// Control light               -->  GET/PUT ${baseUrl}/elgato/lights
// Read/update lights settings -->  GET/PUT ${baseUrl}/elgato/lights/settings
// Read/udpate info            -->  GET/PUT ${baseUrl}/elgato/accessory-info
//
//
// Control light               -->  GET/PUT ${baseUrl}/elgato/lights
// {
//   "numberOfLights": 1,
//   "lights": [
//       {
//           "on": 0,
//           "brightness": 17,
//           "temperature": 162
//       }
//   ]
// }
//
// Read/update lights settings -->  GET/PUT ${baseUrl}/elgato/lights/settings
// {
//   "powerOnBehavior": 2, // 1: restore last used setting, 2: use setting values
//   "powerOnBrightness": 3,
//   "powerOnTemperature": 143,
//   "switchOnDurationMs": 100,
//   "switchOffDurationMs": 300,
//   "colorChangeDurationMs": 100
// }
//
// Read/udpate info            -->  GET/PUT ${baseUrl}/elgato/accessory-info
// {
//   "productName": "Elgato Key Light Air",
//   "hardwareBoardType": 200,
//   "firmwareBuildNumber": 199,
//   "firmwareVersion": "1.0.3",
//   "serialNumber": "CW31J1A04554",
//   "displayName": "Right",    // only this field is updateable
//   "features": [
//       "lights"
//   ]
// }

const app = express();
const port = 3000;

// serve static files from the public directory
app.use(express.static("public"));
// make sure we understand json
app.use(express.json());

// Configure routes
routes.register(app, "elgato");

// Discover nodes
discovery.register(app);

app.listen(port, '0.0.0.0', () => {
  return console.log(`server is listening on ${port}`);
});
