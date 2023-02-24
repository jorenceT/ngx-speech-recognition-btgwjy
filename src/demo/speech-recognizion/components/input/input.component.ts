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
      var message = e.results[0].item(0).transcript;
      this.MessageHandler(message);
      this.ref.detectChanges();
    };
    this.service.onend = (e) => {
      console.log('onend');
      this.listerning = false;
      this.ref.detectChanges();
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
    } else if (this.commentHandler(['tabout', 'next', 'tab', 'tap', 'out'])) {
      console.log('tabout');
      stop();
      this.focusoutCustom.emit(this.tabIndex);
      this.command = 'tabout';
    } else if (this.commentHandler(['stop', 'abourt'])) {
      console.log('stop');
      stop();
      this.command = 'stop';
    } else {
      this.message = message;
    }
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
