import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit {

  valueName: string = "";
  newResponseForm: FormGroup;
  @ViewChild('responseDisplay') responseDisplayInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddResponseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newResponseForm = new FormGroup({
      responseDisplay: new FormControl('', Validators.required),
      responseName: new FormControl('', Validators.required)
    });
    this.responseDisplayInput.focus();
  }

  response(value){
    if(value == ""){
      this.valueName = value;
      this.newResponseForm.patchValue({
        responseName: this.valueName,
      });
    }
    else {
      value = value.trim();
      this.valueName = "utter_";
      this.valueName = this.valueName + value.replace(/ /g, '_');
      this.newResponseForm.patchValue({
        responseName: this.valueName,
      });
    }
  }

  closeDialog() {
    if (this.newResponseForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        response_display: this.newResponseForm.value.responseDisplay,
        response_name: this.newResponseForm.value.responseName,
        response_description: "Exemplo"
      });
    }
  }

}
