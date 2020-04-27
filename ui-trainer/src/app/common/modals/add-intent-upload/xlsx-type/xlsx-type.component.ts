import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatTable, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IntentUpload } from 'src/app/common/models/intent_upload';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-xlsx-type',
  templateUrl: './xlsx-type.component.html',
  styleUrls: ['./xlsx-type.component.scss']
})

export class XlsxTypeComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) datatable: MatTable<any>;
  appSource: string;
  columnsOrder: string[] = ["select", "intentDisplay", "intentName", "description", "example"];
  intentsData: IntentUpload[] = [];
  selectedIntents: IntentUpload[] = [];
  dataSource: MatTableDataSource<IntentUpload> = new MatTableDataSource<IntentUpload>(this.intentsData);
  selection: SelectionModel<IntentUpload> = new SelectionModel<IntentUpload>(true, []);

  constructor(public dialogRef: MatDialogRef<XlsxTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.selection.changed.subscribe((intents) => this.selectedIntents = intents.source.selected);

    this.data.uploadedIntents.subscribe(
      (intent) => this.intentsData.push(intent),
      (error) => console.error(error),
      () => this.dataSource.data = this.intentsData,
    );
  }

  ngOnDestroy() {
    this.data.uploadedIntents.unsubscribe();
    this.selection.changed.unsubscribe();
  }

  masterToggle(){
    if(this.allSelected()){
      this.selection.clear();
    }
    else {
      this.dataSource.data.forEach(checkbox => this.selection.select(checkbox));
    }
  }

  allSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  label(row?: IntentUpload): string {
    if(!row){
      return `${this.allSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.intent_display}`;
  };

  toJson(){
    let intents: IntentUpload[] = [], jump: number[] = [];
    for(let i=0; i<this.selectedIntents.length; i++){
      if(jump.includes(i, 0)){ // não itera sobre os objetos cujo text_entities já foi incluído em outro objeto
        continue;
      }
      for(let k=i+1; k<this.selectedIntents.length; k++){ // testa se o nome da intent na posição i é igual ao nome das posições a frente
        if(this.selectedIntents[i].intent_name === this.selectedIntents[k].intent_name){ // se for, inclui o obj text_entities no array na posição i
          if(!this.selectedIntents[i].text_entities.includes(this.selectedIntents[k].text_entities[0], 0)){ // evita incusões duplicadas de text_entities
            this.selectedIntents[i].text_entities.push(this.selectedIntents[k].text_entities[0]);
          }
          jump.push(k); // inclui a posição k no array de posições que não devem ser iteradas
        }
      }
      this.selectedIntents[i].domain_id = this.data.domainObjectId;   // completa campos
      this.selectedIntents[i].project_id = this.data.projectObjectId;
      intents.push(this.selectedIntents[i]); // objetos já filtrados
    }
    let intentsJson: string = JSON.stringify(intents);
    this.dialogRef.close(intentsJson);
  }

}
