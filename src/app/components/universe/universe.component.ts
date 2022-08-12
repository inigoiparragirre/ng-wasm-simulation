import { Component, OnInit } from '@angular/core';
import { greet } from 'wasm-universe';

@Component({
  selector: 'simulation',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss']
})
export class UniverseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    greet();
  }

}
