import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { ReadFileService } from '../../services/read-file.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { XlsxStoryComponent } from './xlsx-story/xlsx-story.component';

@Component({
  selector: 'app-add-story-upload',
  templateUrl: './add-story-upload.component.html',
  styleUrls: ['./add-story-upload.component.scss']
})
export class AddStoryUploadComponent implements OnInit, OnDestroy {
  appSource: string;
  tipoArq: string = "";
  newUploadForm: FormGroup;
  private subs: Subscription = new Subscription();
  private arquivo: File;

  constructor(public webSocketService: WebSocketService,
              public uploadedFile: ReadFileService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<AddStoryUploadComponent>,
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
    this.uploadedFile.readStoriesXlsx(this.arquivo, this.data.intents_responses);
    const dialogRef = this.dialog.open(XlsxStoryComponent, {
      height: "800px",
      width: "1100px",
      data: { projectObjectId: this.data.projectObjectId, domainObjectId: this.data.domainObjectId, uploadedStories: this.uploadedFile.storiesSub },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response){
        console.log(response);
      }
    });
  }

}
