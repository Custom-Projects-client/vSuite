import { Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../shared/page-imports';
import { DemoForm } from './demo-form';

// BookDemo page  ->  route "/book-demo"
// - Banner + layout in book-demo.html, the form itself in demo-form.ts / demo-form.html
@Component({
  selector: 'app-book-demo',
  imports: [...PAGE_IMPORTS, DemoForm],
  templateUrl: './book-demo.html',
})
export class BookDemo {}
