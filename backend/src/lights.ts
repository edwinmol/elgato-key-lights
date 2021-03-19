import axios, { AxiosResponse } from "axios";
import { RemoteService } from "bonjour";
import { response } from "express";
import { from, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ElgatoKeyLight, ElgatoKeyLightInfo, ElgatoKeyLightSettings, ElgatoKeyLightStatus } from "./model";

// The lights we want to control
export const lights : Record<string, ElgatoKeyLight> = {};

//sync the status of a single light and return the Light
export function syncStatus(light: ElgatoKeyLight): Observable<ElgatoKeyLight> {
    return from(axios.get(`http://${light.ip}:${light.port}/elgato/lights`)).pipe(
        tap(resp => light.status = resp.data.lights[0]),
        map(() => light)
    )
}

//sync the name of a single light and return the Light
export function syncName(light: ElgatoKeyLight): Observable<ElgatoKeyLight> {
    return from(axios.get<ElgatoKeyLightInfo>(`http://${light.ip}:${light.port}/elgato/accessory-info`)).pipe(
        tap(resp => light.name = resp.data.displayName ? resp.data.displayName : light.name),
        map(() => light)
    )
}

export function blink(lightId: string): Observable<ElgatoKeyLight> {
    const light: ElgatoKeyLight = lights[lightId];
    return from(axios.post<ElgatoKeyLightInfo>(`http://${light.ip}:${light.port}/elgato/identify`)).pipe(
        map(() => light)
    )
}

export function settings(lightId: string): Observable<ElgatoKeyLightSettings> {
    const light: ElgatoKeyLight = lights[lightId];
    return from(axios.get<ElgatoKeyLightSettings>(`http://${light.ip}:${light.port}/elgato/lights/settings`)).pipe(
        map((response: AxiosResponse<ElgatoKeyLightSettings>) => response.data)
    );
}

export function updateSettings(lightId: string, settings: ElgatoKeyLightSettings): Observable<any> {
    const light: ElgatoKeyLight = lights[lightId];
    return from(axios.put<ElgatoKeyLightSettings>(`http://${light.ip}:${light.port}/elgato/lights/settings`,settings)).pipe(
        map((response: AxiosResponse<ElgatoKeyLightSettings>) => response.data)
    );
}

export function updateAccessoryInfo(lightId: string, info: ElgatoKeyLightInfo): Observable<any> {
    const light: ElgatoKeyLight = lights[lightId];
    light.name = info.displayName;
    return from(axios.put<ElgatoKeyLightInfo>(`http://${light.ip}:${light.port}/elgato/accessory-info`,info)).pipe(
        map((response: AxiosResponse<ElgatoKeyLightInfo>) => response.data)
    );
}

export function updateStatus(lightId: string, status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight> {
    const light: ElgatoKeyLight = lights[lightId];
    return from(axios.put(`http://${light.ip}:${light.port}/elgato/lights`,{"lights":[status]}))
        .pipe(
            tap(resp => light.status = resp.data.lights[0]),
            map(() => light)
    )
}

export function registerLight(service: RemoteService) {
    const id = service.host.split('.')[0];
    if (!lights[id]) {
        console.log(`Register device ${id}`);
        lights[id] = {
            id: id, 
            ip:service.addresses[0], 
            name: service.name, 
            port: service.port
        };
        //fetch the displayName from the light
        syncName(lights[id]).subscribe();
    }
}