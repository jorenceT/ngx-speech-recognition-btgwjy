import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  SpeechRecognitionLang,
  SpeechRecognitionMaxAlternatives,
  SpeechRecognitionService,
} from '../../../../../projects/ngx-speech-recognition/src/public_api';
import { inputType, TabData } from '../Interface/tab-data-model';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
})
export class MainPageComponent {
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
  message = '';
  command = '';
  tabData: TabData[] = [
    { index: 0, active: false, type: inputType.text },
    { index: 1, active: false, type: inputType.text },
    { index: 2, active: false, type: inputType.button, name: 'stop' },
  ];
  listerning = false;

  currentActiveField = 0;

  focusout(index: number) {
    console.log('tabout triggered' + index + this.tabData.length);
    index = index + 1;
    if (index < this.tabData.length) {
      this.focusInInput(index);
    } else {
      this.focusInInput(0);
    }
  }

  test() {
    this.focusout(1);
  }

  executeFunction(event: string) {
    console.log('execute function');
    if (event == 'stop') {
      this.stop();
    }
  }

  focusInInput(index: number) {
    console.log('setting next field');
    this.tabData[index].active = true;
    this.tabData[index] = { ...this.tabData[index] };
    this.currentActiveField = index;
    this.ref.detectChanges();
  }
  stop() {
    console.log('stop executed');
    this.tabData[this.currentActiveField].active = false;
    this.tabData[this.currentActiveField] = {
      ...this.tabData[this.currentActiveField],
    };
  }

  listen() {}

  private MessageHandler(message: string) {
    if (this.commentHandler(['stop button'], false)) {
      this.executeFunction('stop');
    } else if (this.commentHandler(['stop'])) {
      stop();
    } else if (this.commentHandler(['focus Field'])) {
      let trimedMessage = message.trim();
      let parsed = parseInt(trimedMessage, 10);
      if (isNaN(parsed)) {
        return;
      }
      this.focusout(parsed);
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
