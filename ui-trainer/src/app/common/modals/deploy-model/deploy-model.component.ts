import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-deploy-model',
  templateUrl: './deploy-model.component.html',
  styleUrls: ['./deploy-model.component.scss']
})
export class DeployModelComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeployModelComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  copyScriptToClipboard() {
    const scriptTag = ' \
    <script src="https://storage.googleapis.com/mrbot-cdn/webchat-latest.js"></script>\n \
    <script>\n \
      WebChat.default.init({\n \
        selector: "#webchat",\n \
        initPayload: "/greet",\n \
        customData: {"userID": "teste"}, // arbitrary custom data. Stay minimal as this will be added to the socket \
        socketUrl: "http://localhost:5005",\n \
        socketPath: "/socket.io/",\n \
        title: "Hermes",\n \
        subtitle: "O mensageiro oficial do Monte Kyros!",\n \
        profileAvatar: "avatar.png",\n \
        params: {\n \
        images: {\n \
          dims: {\n \
            width: 300,\n \
            height: 200\n \
          }\n \
        },\n \
        storage: "session"\n \
      }\n \
      })\n \
    </script>\n'
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = scriptTag;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  confirmDeploy() {
    this.dialogRef.close(true);
  }

}
