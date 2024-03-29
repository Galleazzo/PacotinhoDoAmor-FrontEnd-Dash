import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'formly-field-input',
    template: `
   <input type="file" [formControl]="formControl" [formlyAttributes]="field">
 `,
})
export class FormlyFieldInputFile extends FieldType<FieldTypeConfig> { } 