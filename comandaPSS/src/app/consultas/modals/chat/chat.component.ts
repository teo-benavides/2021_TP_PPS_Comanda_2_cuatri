import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from '../../../services/chat.service';
import { Mensaje } from '../../../models/interfaces/chat.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewInit, OnInit {
  @Input() path: number;
  @Input() color: string;
  @ViewChild('msg', { static: false }) private myScrollContainer: ElementRef;
  mensajes: Mensaje[];
  msgForm: FormGroup;

  constructor(
    private modalController: ModalController,
    public chatService: ChatService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.msgForm = this.formBuilder.group({
      msg: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  ngAfterViewInit() {
    this.chatService
      .init()
      .then(() => {
        this.chatService
          .getConsultas(this.path.toString())
          .subscribe((data) => {
            console.log(data);
            this.mensajes = [];
            this.mensajes.push(...data);
            this.scrollToBottom();
          });
      })
      .catch((error) => {
        console.log(error);
        this.cancelar();
      });
  }

  onSubmit() {
    const { msg } = this.msgForm.value;
    this.chatService.enviarConsulta(this.path.toString(), msg);
    this.msgForm.reset();
  }

  scrollToBottom(): void {
    try {
      this.changeDetectorRef.detectChanges();

      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  cancelar() {
    this.modalController.dismiss();
  }
}
