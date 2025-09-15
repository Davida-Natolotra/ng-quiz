import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OuServer } from './services/ou-server';
import { map, pipe } from 'rxjs';
import { OuSignals } from './services/ou-signals';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('ng-quiz');
  OUServer = inject(OuServer);
  OUsig = inject(OuSignals).OuSig;
  OULevSig = inject(OuSignals).OuLevSig;

  ngOnInit(): void {
    this.OUServer.getOrgUnits().subscribe((e) => {
      this.OUsig.set(e.organisationUnits);
      console.log('Org unit', this.OUsig());
      this.OULevSig.set(e.organisationUnitLevels);
      console.log('Org unit level', this.OULevSig());
    });
  }
}
