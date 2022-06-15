import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() error: string = '';
  @Output() clearError = new EventEmitter<string>();
  constructor(private router: Router) {}

  resetError(error:string) {
    this.clearError.emit(error)
  }

  goHome() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
}
