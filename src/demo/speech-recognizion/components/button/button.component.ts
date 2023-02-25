import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SpeechRecognitionLang,
  SpeechRecognitionMaxAlternatives,
  SpeechRecognitionService,
} from '../../../../../projects/ngx-speech-recognition/src/public_api';
import { ControlerBase } from '../base/controler-base';
import { commentHandler } from '../base/helper-class';

@Component({
  selector: 'button-speach-enabled',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  providers: [
    {
      provide: SpeechRecognitionLang,
      useValue: 'en-US',
    },
    {
      provide: SpeechRecognitionMaxAlternatives,
      useValue: 1,
    },
    SpeechRecognitionService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends ControlerBase {
  public command = 'command';

  constructor(
    private serviceInt: SpeechRecognitionService,
    private refInt: ChangeDetectorRef
  ) {
    super(serviceInt, refInt);
  }

  test() {
    this.controlRef.nativeElement.focus();
  }

  executeFunction() {
    this.functionExecuteCustom.emit(this.name);
  }

  protected messageHandler(message: string): void {
    if (commentHandler(['Click'], message)) {
      this.functionExecuteCustom.emit(this.name);
    }
    if (commentHandler(['tabout', 'next', 'tab', 'tap'], message)) {
      stop();
      this.focusoutCustom.emit(this.tabIndex);
      this.command = 'tabout';
    }
    if (commentHandler(['stop', 'abourt'], message)) {
      stop();
      this.command = 'stop';
    }
    this.ref.detectChanges();
  }
}
