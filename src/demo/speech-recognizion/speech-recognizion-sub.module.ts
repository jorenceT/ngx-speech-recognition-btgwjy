import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { InputComponent, ButtonComponent } from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [InputComponent, ButtonComponent],
  exports: [InputComponent, ButtonComponent],
})
export class SpeechRecognizionSubModule {}
