import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { inputType, TabData } from '../Interface/tab-data-model';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  constructor(private ref: ChangeDetectorRef) {}

  tabData: TabData[] = [
    { index: 0, active: false, type: inputType.text },
    { index: 1, active: false, type: inputType.text },
    { index: 2, active: false, type: inputType.button, name: 'stop' },
  ];

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
}
