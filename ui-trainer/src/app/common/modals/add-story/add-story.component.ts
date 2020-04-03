import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.scss']
})
export class AddStoryComponent implements OnInit {

  valueName: string = "";
  newStoryForm: FormGroup;
  @ViewChild('storyDisplay') storyDisplayInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddStoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newStoryForm = new FormGroup({
      storyDisplay: new FormControl('', Validators.required),
      storyName: new FormControl('', Validators.required),
      storyDescription: new FormControl('', Validators.required)
    });
    this.storyDisplayInput.focus();
  }

  story(value){
    if(value == ""){
      this.valueName = value;
      this.newStoryForm.patchValue({
        storyName: this.valueName,
      });
    }
    else {
      value = value.trim();
      this.valueName = "story_";
      this.valueName += value.replace(/ /g, '_');
      this.newStoryForm.patchValue({
        storyName: this.valueName,
      })
      console.log(this.newStoryForm.value.storyName);
  }
}

  closeDialog() {
    if (this.newStoryForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        story_display: this.newStoryForm.value.storyDisplay,
        story_name: this.newStoryForm.value.storyName,
        story_description: this.newStoryForm.value.storyDescription
      });
    }
  }

}
