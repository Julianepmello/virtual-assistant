import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { XlsxTypeComponent } from './xlsx-type/xlsx-type.component';
import { ReadFileService } from '../../services/read-file.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-intent-upload',
  templateUrl: './add-intent-upload.component.html',
  styleUrls: ['./add-intent-upload.component.scss']
})
export class AddIntentUploadComponent implements OnInit, OnDestroy {
  appSource: string;
  tipoArq: string = "";
  private flag: boolean = true;
  private arquivo: File;
  private dialogSub: Subscription = new Subscription();
  newUploadForm: FormGroup;

  constructor(public webSocketService: WebSocketService,
              public uploadedFile: ReadFileService,
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
      this.tipoArq = fileType;
      if(this.newUploadForm.get("selArchive").disabled){
        this.newUploadForm.controls["selArchive"].enable();
      }
      // console.log(this.tipoArq);
    });

    this.newUploadForm.get("selArchive").valueChanges.subscribe((arq: File) => {
      // console.log(arq);
      this.arquivo = arq;
      // console.log(this.arquivo);
    });
  }

  ngOnDestroy(){
    this.dialogSub.unsubscribe();
  }

  nextStep(){
    this.uploadedFile.readXlsx(this.arquivo);
    const dialogRef = this.dialog.open(XlsxTypeComponent, {
      height: "700px",
      width: "1100px",
      data: { projectObjectId: this.data.projectObjectId, domainObjectId: this.data.domainObjectId, uploadedIntents: this.uploadedFile.intentsSub },
    });
    this.dialogSub = dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if(response){
        this.webSocketService.createIntentsFromUpload(response, "domain_" + this.data.domainObjectId);
      }
    })
  }

}
