import { Component, Input } from '@angular/core';
import { ModalData } from '../../models/modal-data.model';
import { ModalService } from '../../services/modal/modal.service';
import { I18NPipe } from '../../utils/pipes/i18n/i18n.pipe';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [I18NPipe],
})
export class ModalComponent {
  constructor(private modalService: ModalService) {}

  @Input() data: ModalData = {
    title: '',
    content: '',
    yesFunc: undefined,
    noFunc: undefined,
  };

  async yesAction(): Promise<void> {
    if (this.data.yesFunc) {
      await this.data.yesFunc();
    }
    await this.modalService.closeModal();
  }

  async noAction(): Promise<void> {
    if (this.data.noFunc) {
      await this.data.noFunc();
    }
    await this.modalService.closeModal();
  }
}
