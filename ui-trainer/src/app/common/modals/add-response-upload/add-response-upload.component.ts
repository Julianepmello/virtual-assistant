import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { WebSocketService } from '../../services/web-socket.service';
import { ReadFileService } from '../../services/read-file.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { XlsxResponseComponent } from './xlsx-response/xlsx-response.component';

@Component({
  selector: 'app-add-response-upload',
  templateUrl: './add-response-upload.component.html',
  styleUrls: ['./add-response-upload.component.scss']
})
export class AddResponseUploadComponent implements OnInit, OnDestroy {
  appSource: string;
  tipoArq: string = "";
  newUploadForm: FormGroup;
  private subs: Subscription = new Subscription();
  private arquivo: File;

  constructor(public webSocketService: WebSocketService,
              public uploadedFile: ReadFileService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<AddResponseUploadComponent>,
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
    this.uploadedFile.readResponsesXlsx(this.arquivo);
    const dialogRef = this.dialog.open(XlsxResponseComponent, {
      height: "800px",
      width: "1100px",
      data: { projectObjectId: this.data.projectObjectId, domainObjectId: this.data.domainObjectId, uploadedResponses: this.uploadedFile.responsesSub },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response){
        console.log(response);
        this.webSocketService.createResponsesFromUpload(response, "domain_" + this.data.domainObjectId);
      }
    });

  }

}
