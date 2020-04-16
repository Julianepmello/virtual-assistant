import { Injectable } from '@angular/core';
import { IntentUpload } from '../models/intent_upload';
import * as Excel from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {

  constructor() {
  }

  readXlsx(file: File): IntentUpload[] {
    let intents: IntentUpload[] = [];
    let novo: IntentUpload;
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
      // console.log(wb);
      let ws: Excel.WorkSheet = wb.Sheets[wb.SheetNames[0]];
      let k: number = ws["!ref"].length - 1; // !ref guarda info de célula e linha inicial, até célula e linha final em string, o último caracter mostra a quantidade de linhas do arquivo
      let numRows: number = parseInt(ws["!ref"].charAt(k)); // tranforma o número em string para int
      // console.log(numRows)
      let cell: any, addrCell: string;
      for(let R=0; R<numRows; R++){ // linhas
        addrCell = Excel.utils.encode_cell({ c: 0, r: R }); // tranforma o objeto (0-index) passado como arg para o endereçamento de célula do tipo A1, B2, etc (1-index)
        cell = ws[addrCell];
        display = cell.v;
        // console.log(display);
        addrCell = Excel.utils.encode_cell({ c: 1, r: R });
        cell = ws[addrCell];
        name = cell.v
        // console.log(name);
        addrCell = Excel.utils.encode_cell({ c: 2, r: R });
        cell = ws[addrCell]
        desc = cell.v
        // console.log(desc);
        addrCell = Excel.utils.encode_cell({ c: 3, r: R });
        cell = ws[addrCell];
        ex = cell.v
        // console.log(ex);
        novo = { intentDisplay: display, intentName: name, description: desc, example: ex };
        intents.push(novo);
      }
    }
    console.log(intents.length); // retornar como obs talvez
    return intents;
  }
}
