import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FabricCanvas, Handler } from '../../components/API';
import { debounce } from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';
import { v4 } from 'uuid';
import { fabric } from 'fabric';
import { SubscriptionLike } from 'rxjs';

const defaultCanvasOption = {
  preserveObjectStacking: true,
  width: -1,
  height: -1,
  selection: true,
  defaultCursor: 'default',
  backgroundColor: '#f3f3f3',
};

const defaultKeyboardEvent = {
  move: true,
  all: true,
  esc: true,
  del: true,
  transaction: false,
  zoom: true,
  clone: true,
};

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {

  public handler: Handler;
  public canvas: FabricCanvas;
  private resizeObserver: ResizeObserver;

  public container;

  // subscribe: SubscriptionLike;

  ready = false;

  // public unId = v4();

  constructor() { }

  ngOnInit(): void {
    this.container = document.getElementById('container');
    this.createObserver();
    const mergedCanvasOption = Object.assign({}, defaultCanvasOption);
    this.canvas = new fabric.Canvas('canvas', mergedCanvasOption);
    this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
    this.canvas.FX_DURATION = 250;
    this.canvas.renderAll();

    this.handler = new Handler({
      id: v4(),
      canvas: this.canvas,
      keyEvent: Object.assign({}, defaultKeyboardEvent),
      canvasOption: mergedCanvasOption,
      static: true  
    });

    this.handler.attachEventListener();

    const onBlueprintLoad = () => {
      this.handler?.resizeWorkareaFit();
      this.handler?.setInteractionMode('grab');

      this.ready = true; 
    };

    this.handler?.on('blueprint:load', onBlueprintLoad);
    console.log(this.handler);
  }

  createObserver = () => {
    const resize = debounce((width: number, height: number) => this.handler.resize(width, height), 500, { leading: true, trailing: true });
    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const { width = 0, height = 0 } = (entries[0] && entries[0].contentRect) || {};
      resize(width, height);
    });
    this.resizeObserver.observe(this.container);
  }

  cancelObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
