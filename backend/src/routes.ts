import * as express from "express";
import { forkJoin } from "rxjs";
import { blink, lights, settings, syncStatus, updateAccessoryInfo, updateSettings, updateStatus } from "./lights";
import { ElgatoKeyLightStatus } from "./model";

export const register = ( app: express.Application, cp?: string ) => {

    // Return the list of registered lights
    app.get(basePath(cp), (req, res) => {
        return forkJoin(Object.keys(lights).map(id => syncStatus(lights[id])))
            .subscribe(lights => res.send(lights));
    });
    // Set status of 'all' registered lights simultaneously
    app.put(basePath(cp), (req, res) => {
        const body = req.body;  
        if (body) {            
            const ids = Object.keys(lights);
            const cmd: ElgatoKeyLightStatus = extractStatus(body);
            console.log(cmd);
            return forkJoin(ids.map(id => updateStatus(id,cmd)))
                .subscribe(lights => res.send(lights));
                    
        } else {
            res.send({result: "no change"});  
        }
    });
    // Get light by id
    app.get(basePath(cp)+':id', (req, res) => {
        syncStatus(lights[req.params.id]).subscribe(
            (light) => res.send(light),
            () => res.send({result: "error"})
        );
    });
    // Blink a light
    app.post(basePath(cp)+':id', (req, res) => {
        blink(req.params.id)
            .subscribe(
                (light) => res.send(light),
                (error) => {
                    console.log(error);
                    res.send({result: "error"});
                });        
    });
    // Set status of an individual light with its id
    app.put(basePath(cp)+':id', (req, res) => {
        const body = req.body;  
        if (body) {
            const cmd: ElgatoKeyLightStatus = extractStatus(body);
            updateStatus(req.params.id,cmd)
                .subscribe(
                    (light) => res.send(light),
                    (error) => {
                        console.log(error);
                        res.send({result: "error"});
                    });        
        } else {
            res.send({result: "no change"});  
        }
    });
    // Get light settings
    app.get(basePath(cp)+'settings/:id', (req, res) => {
        settings(req.params.id)
            .subscribe(
                (result) => res.send(result),
                (error) => {
                    console.log(error);
                    res.send({result: "error"});
                }
            )
        }
    );    
    // Update light settings
    app.put(basePath(cp)+'settings/:id', (req, res) => {
        updateSettings(req.params.id,req.body)
            .subscribe(
                (result) => res.send(result),
                (error) => {
                    console.log(error);
                    res.send({result: "error"});
                }
            )
        }
    );    
    // Update accessory info: displayName
    app.put(basePath(cp)+'info/:id', (req, res) => {
        if (req.body && req.body.displayName) {            
            updateAccessoryInfo(req.params.id,req.body)
            .subscribe(
                (result) => res.send(result),
                (error) => {
                    console.log(error);
                    res.send({result: "error"});
                }
            )
        } else {
            res.send({result: "no change"});
        }
    });      

};

function basePath(contextPath?: string) {
    return contextPath?'/'+contextPath+'/':'/';
}

function extractStatus(body: any): ElgatoKeyLightStatus {
    var result: ElgatoKeyLightStatus = {};
    result.on = body.on ? body.on : 0;

    if (body.brightness) {
        result.brightness = body.brightness;
    }    
    if (body.temperature) {
        result.temperature = body.temperature;
    }
    return result;
}
