import { Component, OnInit } from '@angular/core';
import {
  ElgatoKeyLight,
  ElgatoKeyLightStatus,
} from '../model/elgato-key-light';
import { ElgatoService } from '../service/elgato.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lights: ElgatoKeyLight[];
  synchronize: boolean = false;
  allOn: boolean;

  constructor(private elgatoService: ElgatoService) {}

  ngOnInit(): void {
    this.elgatoService.get().subscribe((lights) => {
      this.lights = lights;
      this.checkAllOn();
    });
  }

  toggleSynchonize() {
    this.synchronize = !this.synchronize;
  }

  setBrightness(id: string, value: number) {
    const index = this.lights.findIndex((v) => v.id === id);
    const light = this.lights[index];
    const newStatus = { ...this.lights[index].status, brightness: value };
    if (!this.synchronize) {
      this.updateSingle(id, newStatus);
    } else {
      this.updateAll(newStatus);
    }
  }

  setTemperature(id: string, value: number) {
    const index = this.lights.findIndex((v) => v.id === id);
    const light = this.lights[index];
    const newStatus = { ...this.lights[index].status, temperature: value };
    if (!this.synchronize) {
      this.updateSingle(id, newStatus);
    } else {
      this.updateAll(newStatus);
    }
  }

  toggle(id: string) {
    const index = this.lights.findIndex((v) => v.id === id);
    const light = this.lights[index];
    this.updateSingle(id, { on: light.status.on ? 0 : 1 });
  }

  toggleAll() {
    this.updateAll({ on: this.allOn ? 0 : 1 });
  }

  updateSingle(id: string, status: ElgatoKeyLightStatus) {
    const index = this.lights.findIndex((v) => v.id === id);
    this.elgatoService.update(id, status).subscribe((light) => {
      this.lights[index] = light;
      this.checkAllOn();
    });
  }

  updateAll(status: ElgatoKeyLightStatus) {
    this.elgatoService.updateAll(status).subscribe((lights) => {
      this.lights = lights;
      this.checkAllOn();
    });
  }

  checkAllOn() {
    this.allOn = !this.lights.map((v) => v.status.on).includes(0);
  }
}
