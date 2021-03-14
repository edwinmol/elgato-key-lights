import axios from 'axios';
import express from 'express';
import { forkJoin, from, Observable, of } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';
import { DiscoveredService, ElgatoKeyLight, ElgatoKeyLightStatus } from './model/elgato-key-lights';

var bonjour = require('bonjour')()

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

// The lights we want to control
let lights : Record<string, ElgatoKeyLight> = {
};

function syncStatus(light: ElgatoKeyLight): Observable<ElgatoKeyLight> {
    return from(axios.get(`http://${light.ip}:9123/elgato/lights`)).pipe(
        tap(resp => light.status = resp.data.lights[0]),
        map(() => light)
    )
}

function updateStatus(lightId: string, status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight> {
    const light: ElgatoKeyLight = lights[lightId];
    return from(axios.put(`http://${light.ip}:9123/elgato/lights`,{"lights":[status]})).pipe(
        tap(resp => light.status = resp.data.lights[0]),
        map(() => light)
    )
}

function registerLight(service: DiscoveredService) {
    const id = service.host.split('.')[0];
    if (!lights[id]) {
        lights[id] = {id: id, ip:service.addresses[0], name: service.name};
    }
}

app.get('/', (req, res) => {
    return forkJoin(Object.keys(lights).map(light => syncStatus(lights[light]))).subscribe(lights => res.send(lights));
});
app.put('/', (req, res) => {
    const body = req.body;  
    if (body) {
        
        //const ids: string[] = (Array.isArray(req.query.id) ? req.query.id : [req.query.id]) as string[];
        const ids = Object.keys(lights);
        const cmd: ElgatoKeyLightStatus = {
            on: body.on ? 1 : 0, 
            brightness: body.brightness, 
            temperature: body.temperature
        };

        return forkJoin(ids.map(id => updateStatus(id,cmd))).subscribe(lights => res.send(lights));
                
    } else {
        res.send({result: "no change"});  
    }
});
app.put('/:id', (req, res) => {
    const body = req.body;  
    if (body) {
        const cmd: ElgatoKeyLightStatus = {
            on: body.on ? 1 : 0, 
            brightness: body.brightness, 
            temperature: body.temperature
        };
        updateStatus(req.params.id,cmd).subscribe(light => res.send(light));        
    } else {
        res.send({result: "no change"});  
    }
});
app.post('/:id', (req, res) => {
    const light: ElgatoKeyLight = lights[req.params.id];
    axios.post(`http://${light.ip}:9123/elgato/identify`,{})
    res.send({result: "OK"});
});

// browse for all elgato services
bonjour.find({ type: 'elg' }, function (service: DiscoveredService) {
    console.log('Found an elgato light:', service.name)
    registerLight(service);
})


app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
