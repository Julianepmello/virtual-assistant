import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { ResponseUpload } from 'src/app/common/models/response_upload';
import { environment } from 'src/environments/environment';
import { MatTable, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-xlsx-response',
  templateUrl: './xlsx-response.component.html',
  styleUrls: ['./xlsx-response.component.scss']
})
export class XlsxResponseComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) datatable: MatTable<any>;
  appSource: string;
  columnsOrder: string[] = ["select", "responseDisplay", "responseName", "response"];
  responsesData: ResponseUpload[] = [];
  selectedResponses: ResponseUpload[] = [];
  dataSource: MatTableDataSource<ResponseUpload> = new MatTableDataSource<ResponseUpload>();
  selection: SelectionModel<ResponseUpload> = new SelectionModel<ResponseUpload>(true, []);

  constructor(public dialogRef: MatDialogRef<XlsxResponseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.selection.changed.subscribe((responses) => this.selectedResponses = responses.source.selected);

    this.data.uploadedResponses.subscribe(
      (responses) => this.responsesData = responses,
      (error) => console.error(error),
      () => this.dataSource.data = this.responsesData,
    );

    this.dataSource.filterPredicate = (data: ResponseUpload, filter: string) =>
      data.response_name.toLowerCase().includes(filter, 0) || data.response_display.toLowerCase().includes(filter, 0) ||
      data.text_entities[0].toLowerCase().includes(filter, 0);
  }

  ngOnDestroy(){
    this.data.uploadedResponses.unsubscribe();
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

  label(row?: ResponseUpload): string {
    if(!row){
      return `${this.allSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.response_display}`;
  }

  toJson(){
    let responses: ResponseUpload[] = [], jump: number[] = [];
    for(let i=0; i<this.selectedResponses.length; i++){
      if(jump.includes(i, 0)){
        continue;
      }
      for(let k=i+1; k<this.selectedResponses.length; k++){
        if(this.selectedResponses[i].response_name === this.selectedResponses[k].response_name){
          if(!this.selectedResponses[i].text_entities.includes(this.selectedResponses[k].text_entities[0], 0)){
            this.selectedResponses[i].text_entities.push(this.selectedResponses[k].text_entities[0])
          }
          jump.push(k);
        }
      }
      this.selectedResponses[i].domain_id = this.data.domainObjectId;
      this.selectedResponses[i].project_id = this.data.projectObjectId;
      responses.push(this.selectedResponses[i]);
    }
    let aux: string = JSON.stringify(responses);
    let responsesJson: ResponseUpload[] = JSON.parse(aux);
    console.log(responsesJson);
    this.dialogRef.close(responsesJson);
  }

  filter(str: string){
    this.dataSource.filter = str.trim().toLowerCase();
  }

}
