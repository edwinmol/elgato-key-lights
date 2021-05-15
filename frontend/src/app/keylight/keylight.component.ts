import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElgatoKeyLight } from '../model/elgato-key-light';
import { ElgatoService } from '../service/elgato.service';

@Component({
  selector: 'app-keylight',
  templateUrl: './keylight.component.html',
  styleUrls: ['./keylight.component.scss'],
})
export class KeylightComponent implements OnInit {
  @Output()
  onBrightnessChange = new EventEmitter<number>();

  @Output()
  onTemperatureChange = new EventEmitter<number>();

  @Output()
  onToggle = new EventEmitter<number>();

  constructor(private elgatoService: ElgatoService) {}

  @Input()
  light: ElgatoKeyLight;

  ngOnInit(): void {}

  toggle() {
    this.light.status.on = this.light.status.on ? 1 : 0;
    this.onToggle.emit(this.light.status.on);
  }
}
