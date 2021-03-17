import axios from "axios";
import { RemoteService } from "bonjour";
import { from, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ElgatoKeyLight, ElgatoKeyLightStatus } from "./model";

// The lights we want to control
export const lights : Record<string, ElgatoKeyLight> = {};

export function syncStatus(light: ElgatoKeyLight): Observable<ElgatoKeyLight> {
    return from(axios.get(`http://${light.ip}:9123/elgato/lights`)).pipe(
        tap(resp => light.status = resp.data.lights[0]),
        map(() => light)
    )
}

export function updateStatus(lightId: string, status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight> {
    const light: ElgatoKeyLight = lights[lightId];
    return from(axios.put(`http://${light.ip}:9123/elgato/lights`,{"lights":[status]}))
        .pipe(
            tap(resp => light.status = resp.data.lights[0]),
            map(() => light)
    )
}

export function registerLight(service: RemoteService) {
    const id = service.addresses[0];
    if (!lights[id]) {
        lights[id] = {id: id, ip:service.addresses[0], name: service.name};
    }
}