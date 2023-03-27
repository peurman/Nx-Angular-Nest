import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ModalService } from '@clapp1/clapp-angular';

@Component({
  selector: 'state-management-app-modal-go-back',
  templateUrl: './modal-go-back.component.html',
  styleUrls: ['./modal-go-back.component.scss'],
})
export class ModalGoBackComponent {
  constructor(private location: Location, private modalService: ModalService) {}

  handleCancel(): void {
    this.modalService.close();
  }

  handleGoBack(): void {
    this.location.back();
  }
}
