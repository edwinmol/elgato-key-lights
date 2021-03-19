import bonjour, { RemoteService } from "bonjour";
import * as express from "express";
import { timer } from "rxjs";
import { registerLight } from "./lights";

const discovery = bonjour();

export const register = ( app: express.Application ) => {
    
    const source = timer(0,30000); //poll every 30 seconds
    
    source.subscribe(() => {
        // browse for all elgato services, identified with 'elg'
        console.log('finding devices');
        discovery.find({ type: 'elg' }, (service: RemoteService) => {
            console.log(`Found an elgato light: ${service.name} - ${service.addresses[0]} - ${service.host.split('.')[0]}`)
            registerLight(service);
        });
    });

};