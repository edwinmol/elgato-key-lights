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