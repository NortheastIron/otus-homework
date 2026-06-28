import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'button[app-button-title]',
  templateUrl: './button.components.html',
  styleUrl: './button.components.scss',
})
export class ButtonComponent {
  public title: InputSignal<string> = input.required({alias: 'app-button-title'});
}
