import bonjour, { RemoteService } from "bonjour";
import * as express from "express";
import { registerLight } from "./lights";

const discovery = bonjour();

export const register = ( app: express.Application ) => {
    
    // browse for all elgato services, identified with 'elg'
    discovery.find({ type: 'elg' }, (service: RemoteService) => {
        console.log('Found an elgato light:', service.name)
        registerLight(service);
    })

};