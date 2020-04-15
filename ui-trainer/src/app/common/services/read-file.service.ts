import { Injectable } from '@angular/core';
import { IntentUpload } from '../models/intent_upload';
import * as Excel from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {

  constructor() {
  }

  readXlsx(file: File) {
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
      console.log(wb);
      return 0;
    }
  }
}
