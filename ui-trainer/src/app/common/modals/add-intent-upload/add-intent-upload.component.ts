import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReadFileService } from '../../services/read-file.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { XlsxIntentComponent } from './xlsx-intent/xlsx-intent.component';

@Component({
  selector: 'app-add-intent-upload',
  templateUrl: './add-intent-upload.component.html',
  styleUrls: ['./add-intent-upload.component.scss']
})
export class AddIntentUploadComponent implements OnInit, OnDestroy {
  appSource: string;
  tipoArq: string = "";
  private arquivo: File;
  private subs: Subscription = new Subscription();
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
      selArchive: new FormControl({ value: '', disabled: true }, Validators.required),
    });

    var sub = this.newUploadForm.get("archiveType").valueChanges.subscribe((fileType) => {
      this.tipoArq = fileType;
      if(this.newUploadForm.get("selArchive").disabled){
        this.newUploadForm.controls["selArchive"].enable();
      }
    });

    var sub2 = this.newUploadForm.get("selArchive").valueChanges.subscribe((arq) => {
      this.arquivo = arq;
    });

    this.subs.add(sub);
    this.subs.add(sub2);
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  nextStep(){
    this.uploadedFile.readIntentsXlsx(this.arquivo);
    const dialogRef = this.dialog.open(XlsxIntentComponent, {
      height: "800px",
      width: "1100px",
      data: { projectObjectId: this.data.projectObjectId, domainObjectId: this.data.domainObjectId, uploadedIntents: this.uploadedFile.intentsSub },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response){
        this.webSocketService.createIntentsFromUpload(response, "domain_" + this.data.domainObjectId);
      }
    });
  }

}
