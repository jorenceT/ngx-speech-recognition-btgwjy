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
  selector: 'input-speach-enabled',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
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
export class InputComponent extends ControlerBase {
  public message = '';
  public command = 'command';

  constructor(
    private serviceInt: SpeechRecognitionService,
    private refInt: ChangeDetectorRef
  ) {
    super(serviceInt, refInt);
  }

  protected messageHandler(message: string) {
    if (commentHandler(['clear', 'delte', 'erase'], message)) {
      this.message = '';
      this.command = 'clear';
    } else if (
      commentHandler(['tabout', 'next', 'tab', 'tap', 'out'], message)
    ) {
      stop();
      this.focusoutCustom.emit(this.tabIndex);
      this.command = 'tabout';
    } else if (commentHandler(['stop', 'abort'], message)) {
      stop();
      this.command = 'stop';
    } else {
      this.message = message;
    }
  }
}
