export interface ElgatoKeyLight {
    id: string,
    name: string,    
    status?: ElgatoKeyLightStatus;
    ip: string,
}

export interface ElgatoKeyLightStatus {
    on: number,
    brightness: number,
    temperature: number
}

export interface DiscoveredService {
    addresses: string[],
    name: string,
    host: string,
    port: string,
}