import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { InputComponent, ButtonComponent, DropDownComponent } from './components';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [InputComponent, ButtonComponent, DropDownComponent],
  exports: [InputComponent, ButtonComponent, DropDownComponent],
})
export class SpeechRecognizionSubModule { }
