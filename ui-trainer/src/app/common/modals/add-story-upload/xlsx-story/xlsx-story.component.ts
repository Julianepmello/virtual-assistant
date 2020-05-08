import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTable, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { StoryUpload } from 'src/app/common/models/story_upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-xlsx-story',
  templateUrl: './xlsx-story.component.html',
  styleUrls: ['./xlsx-story.component.scss']
})
export class XlsxStoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) datatable: MatTable<any>;
  appSource: string;
  columnsOrder: string[] = ["select", "storyDisplay", "storyName", "intentDisplay", "responseDisplay"];
  storiesData: StoryUpload[] = [];
  selectedStories: StoryUpload[] = [];
  dataSource: MatTableDataSource<StoryUpload> = new MatTableDataSource<StoryUpload>();
  selection: SelectionModel<StoryUpload> = new SelectionModel<StoryUpload>(true, []);

  constructor(public dialogRef: MatDialogRef<XlsxStoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.selection.changed.subscribe((stories) => this.selectedStories = stories.source.selected);

    this.data.uploadedStories.subscribe(
      (stories) => this.storiesData = stories,
      (error) => console.error(error),
      () => this.dataSource.data = this.storiesData,
    );
  }

  ngOnDestroy(){
    this.selection.changed.unsubscribe();
  }

  masterToggle(){
    if(this.allSelected()){
      this.selection.clear();
    }
    else {
      this.dataSource.filteredData.forEach((checkbox) => this.selection.select(checkbox));
    }
  }

  allSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  label(row?: StoryUpload): string {
    if(!row){
      return `${this.allSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.story_display}`;
  }

  toJson(){
    for(let i=0; i<this.selectedStories.length; i++){
      this.selectedStories[i].domain_id = this.data.domainObjectId;
      this.selectedStories[i].project_id = this.data.projectObjectId;
    }
    this.dialogRef.close(this.selectedStories);
  }

  filter(str: string){
    this.dataSource.filter = str.trim();
  }

}
