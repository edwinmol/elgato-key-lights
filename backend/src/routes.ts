import axios from "axios";
import { RemoteService } from "bonjour";
import * as express from "express";
import { forkJoin, from, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { lights, syncStatus, updateStatus } from "./lights";
import { ElgatoKeyLight, ElgatoKeyLightStatus } from "./model";

export const register = ( app: express.Application ) => {

    app.get('/', (req, res) => {
        return forkJoin(Object.keys(lights).map(light => syncStatus(lights[light])))
            .subscribe(lights => res.send(lights));
    });
    app.put('/', (req, res) => {
        const body = req.body;  
        if (body) {            
            const ids = Object.keys(lights);
            const cmd: ElgatoKeyLightStatus = {
                on: body.on ? 1 : 0, 
                brightness: body.brightness, 
                temperature: body.temperature
            };
            return forkJoin(ids.map(id => updateStatus(id,cmd)))
                .subscribe(lights => res.send(lights));
                    
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

};