import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTable, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IntentUpload } from 'src/app/common/models/intent_upload';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-xlsx-type',
  templateUrl: './xlsx-type.component.html',
  styleUrls: ['./xlsx-type.component.scss']
})
export class XlsxTypeComponent implements OnInit {
  @ViewChild(MatTable) datatable: MatTable<any>;
  columnsOrder: string[] = ["select", "intentDisplay", "intentName", "description", "example"];
  intentsData: IntentUpload[] = [];
  /*
  intentsData: IntentUpload[] = [
    { intentDisplay: "Intenção um", intentName: "intent_intenção_um", description: "Descrição um", example: "Exemplo um" },
    { intentDisplay: "Intenção dois", intentName: "intent_intenção_dois", description: "Descrição dois", example: "Exemplo dois" },
    { intentDisplay: "Intenção três", intentName: "intent_intenção_três", description: "Descrição três", example: "Exemplo três" },
    { intentDisplay: "Intenção quatro", intentName: "intent_intenção_quatro", description: "Descrição quatro", example: "Exemplo quatro" },
    { intentDisplay: "Intenção cinco", intentName: "intent_intenção_cinco", description: "Descrição cinco", example: "Exemplo cinco" },
  ]; */
  dataSource: MatTableDataSource<IntentUpload>;
  selection: SelectionModel<IntentUpload>;

  constructor(public dialogRef: MatDialogRef<XlsxTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.intentsData = this.data.uploadedIntent;
    this.dataSource = new MatTableDataSource<IntentUpload>(this.intentsData);
    this.selection = new SelectionModel<IntentUpload>(true, []);
  }

  masterToggle(){
    if(this.allSelected()){
      console.log("true");
      this.selection.clear();
    }
    else {
      console.log("false");
      this.dataSource.data.forEach(checkbox => this.selection.select(checkbox));
    }
  }

  allSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log(numRows + ", " + numSelected);
    return numSelected === numRows;
  }

  label(row?: IntentUpload): string {
    if(!row){
      return `${this.allSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.intentDisplay}`;
  };

}
