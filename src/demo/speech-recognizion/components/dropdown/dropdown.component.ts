import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component
} from '@angular/core';
import { find } from 'lodash';
import {
    SpeechRecognitionLang,
    SpeechRecognitionMaxAlternatives,
    SpeechRecognitionService,
} from '../../../../../projects/ngx-speech-recognition/src/public_api';
import { DROPDOWN_ITEMS } from '../../constants/dropdown.constants';
import { ControlerBase } from '../base/controler-base';
import { commentHandler } from '../base/helper-class';
import { controlType } from '../Interface/tab-data-model';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.css'],
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
export class DropDownComponent extends ControlerBase {
    public command = 'command';
    public selectedOption = "";
    public speechReceived = "";
    public demoItem = DROPDOWN_ITEMS;

    constructor(
        private serviceInt: SpeechRecognitionService,
        private refInt: ChangeDetectorRef
    ) {
        super(serviceInt, refInt);
        this.controlType = controlType.input;
    }
    protected localCommandHandler(message: string) {
        this.speechReceived = message;
        if (commentHandler(['clear', 'delete', 'erase'], message)) {
            this.message = '';
            this.command = 'clear';
        } else {
            message = message.replace(/\s/g, "").toLowerCase();
            this.selectedOption = find(this.demoItem, { value: message }) ? message : null;
            this.ref.detectChanges();
        }
    }
}
