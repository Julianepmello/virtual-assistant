import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-intent',
  templateUrl: './add-intent.component.html',
  styleUrls: ['./add-intent.component.scss']
})
export class AddIntentComponent implements OnInit {

  valueName: string = "";
  newIntentForm: FormGroup;
  @ViewChild('intentDisplay') intentDisplayInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddIntentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;

    // define os valores iniciais dos inputs e como obrigatórios
    this.newIntentForm = new FormGroup({
      intentDisplay: new FormControl('', Validators.required),
      intentName: new FormControl('', Validators.required),
      intentDescription: new FormControl('', Validators.required)
    });

    // coloca o foco no input "nome técnico"
    this.intentDisplayInput.focus();
  }

  intent(value){
    if(value == ""){
      this.valueName = value;
      this.newIntentForm.patchValue({
        intentName: this.valueName,
      });
    }
    else {
      value = value.trim();
      this.valueName = "intent_";
      this.valueName = this.valueName + value.replace(/ /g, '_');
      this.newIntentForm.patchValue({
        intentName: this.valueName,
      });
    }
    // console.log(this.newIntentForm.value.intentName);
  }

  closeDialog() {
    // console.log(this.newIntentForm.value.intentName);
    if (this.newIntentForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        intent_name: this.newIntentForm.value.intentName,
        intent_display: this.newIntentForm.value.intentDisplay,
        intent_description: this.newIntentForm.value.intentDescription
      });
    }
  }
}
