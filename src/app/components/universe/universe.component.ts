import { AfterViewInit, Component, OnInit } from '@angular/core';
import { greet, Universe, Cell } from 'wasm-universe';
import { memory } from "wasm-universe/wasm_universe_bg.wasm";


const CELL_SIZE = 10; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';

@Component({
  selector: 'simulation',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss'],
})
export class UniverseComponent implements OnInit, AfterViewInit {

  ctx: CanvasRenderingContext2D | null;
  width!: number;
  height!: number;
  universe: Universe | null;


  // index helper
  getIndex = (row: number, column: number) => {
    return row * this.width + column;
  };

  constructor() {
    this.ctx = null;
    this.universe = null;
  }

  ngOnInit(): void {
    // greet();
  }

  ngAfterViewInit(): void {
    // Construct the universe, and get its width and height.
    this.universe = Universe.new();
    this.width = this.universe.width();
    this.height = this.universe.height();

    // Give the canvas room for all of our cells and a 1px border
    // around each of them.
    const canvas = document.getElementById('universe-canvas') as HTMLCanvasElement;
    canvas.height = (CELL_SIZE + 1) * this.height + 1;
    canvas.width = (CELL_SIZE + 1) * this.width + 1;

    this.ctx = canvas.getContext('2d');

    const renderLoop = () => {
      this.universe?.tick();
    
      this.drawGrid();
      this.drawCells();
    
      window.requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }

  drawGrid() {
    const ctx = this.ctx;

    ctx?.beginPath();
    if (ctx) ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      ctx?.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx?.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * this.height + 1);
    }
  
    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      ctx?.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
      ctx?.lineTo((CELL_SIZE + 1) *this. width + 1, j * (CELL_SIZE + 1) + 1);
    }
  
    ctx?.stroke();
  }

  drawCells() {
    const ctx = this.ctx;
    const cellsPtr = this.universe?.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, this.width * this.height);
  
    ctx?.beginPath();
  
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
  
        if(ctx) ctx.fillStyle = cells[idx] === Cell.Dead
          ? DEAD_COLOR
          : ALIVE_COLOR;
  
        ctx?.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }
  
    ctx?.stroke();

  }





}
