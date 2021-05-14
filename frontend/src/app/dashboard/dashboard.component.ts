import { Component, OnInit } from '@angular/core';
import { ElgatoKeyLight } from '../model/elgato-key-light';
import { ElgatoService } from '../service/elgato.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lights: ElgatoKeyLight[];

  constructor(private elgato: ElgatoService) {}

  ngOnInit(): void {
    this.elgato.get().subscribe((lights) => (this.lights = lights));
  }

  toggle(light: ElgatoKeyLight) {
    this.elgato
      .update(light.id, { ...light.status, on: light.status.on ? 0 : 1 })
      .subscribe((light) => {
        this.lights[this.lights.findIndex((l) => l.id == light.id)] = light;
      });
  }
}
