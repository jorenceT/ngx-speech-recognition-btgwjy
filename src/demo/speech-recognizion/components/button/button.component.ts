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
  selector: 'button-speach-enabled',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
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
export class ButtonComponent {
  public listerning = false;
  public tabIndex = null;
  public command = 'command';
  public name = 'button';

  @Input() set focusin(data: TabData) {
    console.log('came into input ' + data?.index);
    this.name = data.name;
    if (data.active) {
      console.log('activated');
      this.buttonRef.nativeElement.focus();
      this.start('from input');
    } else {
      if (this.listerning) {
        this.stop();
      }
    }
    this.tabIndex = data.index;
    this.ref.detectChanges();
  }

  @ViewChild('buttonControl') buttonRef: ElementRef;

  @Output() focusoutCustom = new EventEmitter<string>();
  @Output() functionExecuteCustom = new EventEmitter<string>();

  constructor(
    private service: SpeechRecognitionService,
    private ref: ChangeDetectorRef
  ) {
    this.service.continuous = true;
    this.service.onresult = (e) => {
      console.log('onresult');
      var message = e.results[0].item(0).transcript;
      this.MessageHandler(message);
      this.start('onresult');
    };
  }

  listen() {
    this.buttonRef.nativeElement.focus();
    if (this.listerning) {
      this.stop();
    } else {
      this.start('listern');
    }
  }

  test() {
    this.buttonRef.nativeElement.focus();
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

  executeFunction() {
    this.functionExecuteCustom.emit(this.name);
  }

  private MessageHandler(message: string) {
    if (this.commentHandler(message, ['Click'], false)) {
      this.functionExecuteCustom.emit(this.name);
    }
    if (this.commentHandler(message, ['tabout', 'next', 'tab', 'tap'])) {
      console.log('tabout');
      stop();
      this.focusoutCustom.emit(this.tabIndex);
      this.command = 'tabout';
    }
    if (this.commentHandler(message, ['stop', 'abourt'])) {
      console.log('stop');
      stop();
      this.command = 'stop';
    }
    this.ref.detectChanges();
  }

  commentHandler(message, list: string[], proccessMessage = true): boolean {
    let result = false;
    list.forEach((commandName) => {
      if (message.includes(commandName)) {
        result = true;
      }
    });
    return result;
  }
}
