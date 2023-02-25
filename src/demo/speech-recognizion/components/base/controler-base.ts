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
import { commentHandler, GLOBAL_COMMAND } from './helper-class';

export abstract class ControlerBase {
  public tabIndex = null;
  public name = '';
  public listerning = false;
  public type = 'text';
  public message = '';

  @Input() set focusin(data: TabData) {
    this.name = data.name;
    this.type = data.type;
    if (data.active) {
      this.controlRef.nativeElement.focus();
      this.start();
    } else {
      if (this.listerning) {
        this.stop();
      }
    }
    this.tabIndex = data.index;
    this.ref.detectChanges();
  }

  @ViewChild('control') controlRef: ElementRef;

  @Output() focusoutCustom = new EventEmitter<number>();
  @Output() functionExecuteCustom = new EventEmitter<string>();
  @Output() executeGlobalCommand = new EventEmitter<string>();

  constructor(
    protected service: SpeechRecognitionService,
    protected ref: ChangeDetectorRef
  ) {
    this.service.continuous = true;
    this.service.onresult = (e) => {
      var message = e.results[e.results.length - 1].item(0).transcript;
      console.log(message);
      this.messageHandler(message, e);
      this.ref.detectChanges();
    };
    this.service.onend = (e) => {
      this.listerning = false;
      this.ref.detectChanges();
    };
  }

  // clearGlobalCommand(e) {
  //   if (e.results.length >= 2) {
  //     this.message = e.results[e.results.length - 2].item(0).transcript;
  //   } else {
  //     this.message = '';
  //   }
  // }

  listen() {
    this.controlRef?.nativeElement?.focus();
    if (this.listerning) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    if (!this.listerning) {
      this.listerning = true;
      this.service.start();
    }
  }

  stop() {
    if (this.listerning) {
      this.listerning = false;
      this.service.abort();
    }
  }

  globalMessageHandler(message, e): boolean {
    var result = false;
    if (message) {
      for (const key in GLOBAL_COMMAND) {
        GLOBAL_COMMAND[key].forEach((value) => {
          if (message.includes(value)) {
            // this.clearGlobalCommand(e);
            this.executeGlobalCommand.emit(message);
            result = true;
          }
        });
      }
    }
    return result;
  }
  messageHandler(message: string, e) {
    if (
      !this.globalMessageHandler(message, e) &&
      !this.commonCommandHandler(message)
    ) {
      this.localCommandHandler(message);
    }
  }
  commonCommandHandler(message: string): boolean {
    if (commentHandler(['tabout', 'next', 'tab', 'out'], message)) {
      stop();
      this.focusoutCustom.emit(this.tabIndex + 1);
      return true;
    } else if (commentHandler(['stop', 'abort'], message)) {
      stop();
      return true;
    } else if (commentHandler(['previous', 'shift tab'], message)) {
      this.focusoutCustom.emit(this.tabIndex - 1);
      return true;
    }
    return false;
  }
  protected abstract localCommandHandler(message: string): void;
}
