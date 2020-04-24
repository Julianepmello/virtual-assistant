import { Injectable } from '@angular/core';
import { IntentUpload } from '../models/intent_upload';
import * as Excel from 'xlsx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {
  public intentsSub: Subject<IntentUpload>;

  constructor() {
  }

  readXlsx(file: File) {
    this.intentsSub = new Subject<IntentUpload>();
    let intents: IntentUpload[] = [];
    let display: string, name: string, desc: string, ex: string;
    let fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = (ev) => {
      let ab: any = fr.result;
      var data = new Uint8Array(ab); // unsigned 8bit int
      var vet = new Array();
      for(let i=0; i<data.length; i++){
        vet[i] = String.fromCharCode(data[i]); // string através dos valores unicode (uint8array)
      }
      var arq = vet.join("");
      let wb: Excel.WorkBook = Excel.read(arq, { type: "binary" });
      let ws: Excel.WorkSheet = wb.Sheets[wb.SheetNames[0]];
      let k: number = ws["!ref"].indexOf(":"); // !ref guarda info de célula e linha inicial, até célula e linha final em string, o último número mostra a quantidade de linhas do arquivo
      k = k + 2;
      let numRows: number = parseInt(ws["!ref"].slice(k)); // tranforma o número em string para int
      let cell: any, addrCell: string;
      for(let R=1; R<numRows; R++){ // linhas, pula linha de cabeçalho
        addrCell = Excel.utils.encode_cell({ c: 0, r: R }); // tranforma o objeto (0-index) passado como arg para o endereçamento de célula do tipo A1, B2, etc (1-index)
        cell = ws[addrCell];
        display = cell.v;
        name = display.replace(/ /g, '_');
        name = "intent_" + name.toLowerCase();
        addrCell = Excel.utils.encode_cell({ c: 1, r: R });
        cell = ws[addrCell];
        desc = cell.v
        addrCell = Excel.utils.encode_cell({ c: 2, r: R });
        cell = ws[addrCell];
        ex = cell.v;
        // console.log(display, name, desc, ex);
        intents.push({ domain_id: "", project_id: "", intent_name: name, intent_display: display, intent_description: desc,
          text_entities: [{ text: ex, entities: [] }] });
      }
      for(let i=0; i<intents.length; i++){
        this.intentsSub.next(intents[i]);
      }
      this.intentsSub.complete();
    }
  }

}
