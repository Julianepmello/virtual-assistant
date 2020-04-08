import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { XlsxTypeComponent } from './xlsx-type/xlsx-type.component';

@Component({
  selector: 'app-add-intent-upload',
  templateUrl: './add-intent-upload.component.html',
  styleUrls: ['./add-intent-upload.component.scss']
})
export class AddIntentUploadComponent implements OnInit {
  appSource: string;
  tipoArq: string;
  newUploadForm: FormGroup;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<AddIntentUploadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newUploadForm = new FormGroup({
      archiveType: new FormControl('', Validators.required),
      selArchive: new FormControl('', Validators.required),
    });
  }

  nextStep(){
    this.tipoArq = this.newUploadForm.get("archiveType").value;
    console.log(this.tipoArq);
  }

}
