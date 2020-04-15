import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { XlsxTypeComponent } from './xlsx-type/xlsx-type.component';
import { ReadFileService } from '../../services/read-file.service';

@Component({
  selector: 'app-add-intent-upload',
  templateUrl: './add-intent-upload.component.html',
  styleUrls: ['./add-intent-upload.component.scss']
})
export class AddIntentUploadComponent implements OnInit {
  appSource: string;
  tipoArq: string = "";
  private flag: boolean = true;
  private arquivo: File;
  newUploadForm: FormGroup;

  constructor(public uploadedFile: ReadFileService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<AddIntentUploadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newUploadForm = new FormGroup({
      archiveType: new FormControl('', Validators.required),
      selArchive: new FormControl({ value: '', disabled: this.flag }, Validators.required),
    });

    this.newUploadForm.get("archiveType").valueChanges.subscribe(fileType => {
      // console.log(this.tipoArq);
      this.tipoArq = "application/vnd.ms-excel.xlsx"//fileType;
      if(this.newUploadForm.get("selArchive").disabled){
        this.newUploadForm.controls["selArchive"].enable();
      }
      // console.log(this.tipoArq);
    });

    this.newUploadForm.get("selArchive").valueChanges.subscribe((arq: File) => {
      console.log(arq);
      this.arquivo = arq;
      console.log(this.arquivo);
    });
  }

  nextStep(){
    const intent = this.uploadedFile.readXlsx(this.arquivo);
    const dialogRef = this.dialog.open(XlsxTypeComponent, {
      height: "700px",
      width: "1100px",
      data: { projectObjectId: this.data.projectObjectId, domainObjectId: this.data.domainObjectId, intentFile: intent },
    });
  }

}
