export interface ElgatoKeyLight {
    id: string,
    name: string,    
    status: ElgatoKeyLightStatus;
}

export interface ElgatoKeyLightStatus {
    on: number,
    brightness?: number,
    temperature?: number
}