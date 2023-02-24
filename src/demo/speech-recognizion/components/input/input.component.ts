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
import { TabData } from '../Interface/tab-data-model';

@Component({
  selector: 'input-speach-enabled',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    // Dependency Inject to SpeechRecognitionService
    // like this.
    //
    // こんな感じで依存解決できます。
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
export class InputComponent {
  public message = '';
  public listerning = false;
  public tabIndex = null;
  public command = 'command';
  public type = 'text';

  @Input() set focusin(data: TabData) {
    console.log('came into input ' + data?.index);
    this.type = data.type;
    if (data.active) {
      console.log('activated');
      this.inputRef.nativeElement.focus();
      this.start('from input');
    } else {
      if (this.listerning) {
        this.stop();
      }
    }
    this.tabIndex = data.index;
    this.ref.detectChanges();
  }

  @ViewChild('inputControl') inputRef: ElementRef;

  @Output() focusoutCustom = new EventEmitter<string>();

  constructor(
    private service: SpeechRecognitionService,
    private ref: ChangeDetectorRef
  ) {
    this.service.continuous = true;
    this.service.onstart = (e) => {
      console.log('onstart');
    };
    this.service.onresult = (e) => {
      console.log('onresult');
      this.message = e.results[0].item(0).transcript;
      this.MessageHandler(this.message);
      this.start('onresult');
      // console.log('SubComponent:onresult', this.message, e);
    };
    this.service.onend = (e) => {
      console.log('onend');
      this.listerning = false;
      this.ref.detectChanges();
    };
    this.service.onspeechend = (e) => {
      console.log('on speach end');
    };

    this.service.onaudioend = (e) => {
      console.log('onaudioend end');
    };
    this.service.onnomatch = (e) => {
      console.log('onnomatch');
    };

    this.service.onsoundend = (e) => {
      console.log('onsoundend');
    };
  }

  listen() {
    this.inputRef.nativeElement.focus();
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

  clearMessage() {}

  private MessageHandler(message: string) {
    if (this.commentHandler(['clear', 'delte', 'erase'], false)) {
      this.message = '';
      this.command = 'clear';
    }
    if (this.commentHandler(['tabout', 'next', 'tab', 'tap', 'out'])) {
      console.log('tabout');
      this.service.stop();
      this.focusoutCustom.emit(this.tabIndex);
      this.command = 'tabout';
    }
    if (this.commentHandler(['stop', 'abourt'])) {
      console.log('stop');
      this.service.stop();
      this.command = 'stop';
    }
    this.ref.detectChanges();
  }

  commentHandler(list: string[], proccessMessage = true): boolean {
    let result = false;
    list.forEach((commandName) => {
      if (this.message.includes(commandName)) {
        if (proccessMessage) {
          this.message = this.message.replace(commandName, '');
        }
        result = true;
      }
    });
    return result;
  }
}
