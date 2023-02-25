import {
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SpeechRecognitionService } from '../../../../../projects/ngx-speech-recognition/src/public_api';
import { TabData } from '../Interface/tab-data-model';

export abstract class ControlerBase {
  public tabIndex = null;
  public name = '';
  public listerning = false;
  public type = 'text';
  @Input() set focusin(data: TabData) {
    console.log('came into input ' + data?.index);
    this.name = data.name;
    this.type = data.type;
    if (data.active) {
      console.log('activated');
      this.controlRef.nativeElement.focus();
      this.start('from input');
    } else {
      if (this.listerning) {
        this.stop();
      }
    }
    this.tabIndex = data.index;
    this.ref.detectChanges();
  }

  @ViewChild('control') controlRef: ElementRef;

  @Output() focusoutCustom = new EventEmitter<string>();
  @Output() functionExecuteCustom = new EventEmitter<string>();

  constructor(
    protected service: SpeechRecognitionService,
    protected ref: ChangeDetectorRef
  ) {
    this.service.continuous = true;
    this.service.onstart = (e) => {
      console.log('onstart');
    };
    this.service.onresult = (e) => {
      console.log('onresult');
      var message = e.results[0].item(0).transcript;
      this.messageHandler(message);
      this.ref.detectChanges();
    };
    this.service.onend = (e) => {
      console.log('onend');
      this.listerning = false;
      this.ref.detectChanges();
    };
  }

  listen() {
    this.controlRef.nativeElement.focus();
    if (this.listerning) {
      this.stop();
    } else {
      this.start('listern');
    }
  }

  start(calledFrom: string) {
    if (!this.listerning) {
      this.listerning = true;
      console.log('listerning started ' + calledFrom);
      this.service.start();
    } else {
      console.log('listerning cant started ' + calledFrom);
    }
  }

  stop() {
    if (this.listerning) {
      this.listerning = false;
      console.log('listerning stoped');
      this.service.abort();
    } else {
      console.log('listerning cant stop');
    }
  }

  protected abstract messageHandler(message: string): void;
}
