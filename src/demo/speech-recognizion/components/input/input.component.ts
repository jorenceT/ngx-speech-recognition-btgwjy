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
  public command = 'command';

  constructor(
    private serviceInt: SpeechRecognitionService,
    private refInt: ChangeDetectorRef
  ) {
    super(serviceInt, refInt);
  }

  // test() {
  //   var val = this.globalMessageHandler('focus zero');
  //   console.log(val);
  //   var val = this.globalMessageHandler('focus one');
  //   console.log(val);
  // }

  protected localCommandHandler(message: string) {
    if (commentHandler(['clear', 'delete', 'erase'], message)) {
      this.message = '';
      this.command = 'clear';
    } else {
      this.message = message;
    }
  }
}
