# Backend API

## Get all discovered elgato key lights

```
GET /elgato
```

example curl:
```
curl -X GET -H "Content-Type: application/json" http://192.168.0.195:3000/elgato | jq

[
  {
    "id": "elgato-key-light-air-8711",
    "ip": "192.168.0.173",
    "name": "Left",
    "port": 9123,
    "status": {
      "on": 1,
      "brightness": 68,
      "temperature": 240
    }
  },
  {
    "id": "elgato-key-light-air-8064",
    "ip": "192.168.0.245",
    "name": "Right",
    "port": 9123,
    "status": {
      "on": 1,
      "brightness": 68,
      "temperature": 240
    }
  }
]
```

## Control all lights simultaneously

```
PUT /elgato
{
    "on": true,
    "brightness": 10,
    "temperature": 300
}
```

example curl:
```
curl -X PUT -H "Content-Type: application/json" -d '{"on":true,     "brightness": 10,"temperature": 300}' http://192.168.0.195:3000/elgato | jq

[
  {
    "id": "elgato-key-light-air-8711",
    "ip": "192.168.0.173",
    "name": "Left",
    "port": 9123,
    "status": {
      "on": 1,
      "brightness": 30,
      "temperature": 200
    }
  },
  {
    "id": "elgato-key-light-air-8064",
    "ip": "192.168.0.245",
    "name": "Right",
    "port": 9123,
    "status": {
      "on": 1,
      "brightness": 30,
      "temperature": 200
    }
  }
]
```

## Get light by id

```
GET /elgato/:id
```

example curl:
```
curl -X GET http://192.168.0.195:3000/elgato/elgato-key-light-air-8711 | jq

{
  "id": "elgato-key-light-air-8711",
  "ip": "192.168.0.173",
  "name": "Left",
  "port": 9123,
  "status": {
    "on": 1,
    "brightness": 30,
    "temperature": 200
  }
}
```

## Identify(Blink) a light

```
POST /elgato/:id
```

example curl
```
curl -X POST http://192.168.0.195:3000/elgato/elgato-key-light-air-8064 | jq

{
  "id": "elgato-key-light-air-8064",
  "ip": "192.168.0.245",
  "name": "Right",
  "port": 9123,
  "status": {
    "on": 0,
    "brightness": 30,
    "temperature": 200
  }
}
```

## Control individual light

```
PUT /elgato/:id

{
    "on": true,
    "brightness": 10,
    "temperature": 300
}
```

example curl:
```
curl -X PUT -H "Content-Type: application/json" -d '{"on":true,     "brightness": 10,"temperature": 300}' http://192.168.0.195:3000/elgato/elgato-key-light-air-8064 | jq

{
  "id": "elgato-key-light-air-8064",
  "ip": "192.168.0.245",
  "name": "Right",
  "port": 9123,
  "status": {
    "on": 1,
    "brightness": 10,
    "temperature": 300
  }
}
```

## Get light settings

```
GET /elgato/settings/:id
```

example curl:
```
curl -X GET http://192.168.0.195:3000/elgato/settings/elgato-key-light-air-8064 | jq

{
  "powerOnBehavior": 1,
  "powerOnBrightness": 10,
  "powerOnTemperature": 143,
  "switchOnDurationMs": 100,
  "switchOffDurationMs": 300,
  "colorChangeDurationMs": 100
}
```

## Update light settings

```
PUT /settings/:id

{
  "powerOnBehavior": 1,
  "powerOnBrightness": 10,
  "powerOnTemperature": 143,
  "switchOnDurationMs": 100,
  "switchOffDurationMs": 300,
  "colorChangeDurationMs": 100
}
```

example curl:
```
curl -X PUT -H "Content-Type: application/json" -d ' {"powerOnBehavior": 1,"powerOnBrightness": 10,"powerOnTemperature": 143,"switchOnDurationMs": 100,"switchOffDurationMs": 300,"colorChangeDurationMs": 100}' http://192.168.0.195:3000/elgato/settings/elgato-key-light-air-8064 | jq

```

## Update display name

```
PUT /elgato/info/:id

{
  "displayName": "My keylight"
}
```

example curl:
```
curl -X PUT -H "Content-Type: application/json" -d '{"displayName": "My keylight"}' http://192.168.0.195:3000/elgato/info/elgato-key-light-air-8064 | jq

```