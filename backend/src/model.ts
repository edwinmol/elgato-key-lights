export interface ElgatoKeyLight {
    id: string,
    name: string,    
    status?: ElgatoKeyLightStatus;
    ip: string,
    port: number,
}

export interface ElgatoKeyLightStatus {
    on?: number,
    brightness?: number, // 0 - 100
    temperature?: number // 143 (7000K) - 344 (2900K)
}

export interface ElgatoKeyLightInfo {
    productName?: string,
    hardwareBoardType?: number,
    firmwareBuildNumber?: number,
    firmwareVersion?: string,
    serialNumber?: string,
    displayName?: string,
    features?: string[]
}

export interface ElgatoKeyLightSettings {
    powerOnBehavior: number, // 1:  2:
    powerOnBrightness: number, // 0 - 100
    powerOnTemperature: number,
    switchOnDurationMs: number,
    switchOffDurationMs: number,
    colorChangeDurationMs: number
}