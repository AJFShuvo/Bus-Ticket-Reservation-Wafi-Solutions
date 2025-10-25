import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',  // Use Angular default naming
  styleUrls: ['./index.component.css'],   // Use plural styleUrls
})
export class IndexComponent {}             // PascalCase + "Component"
