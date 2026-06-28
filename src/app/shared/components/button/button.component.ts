import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'button[app-button-title]',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  public title: InputSignal<string> = input.required({alias: 'app-button-title'});
}
