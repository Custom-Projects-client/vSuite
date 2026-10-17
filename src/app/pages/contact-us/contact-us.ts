import { Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../shared/page-imports';
import { ContactSection } from './contact-section';

// ContactUs page  ->  route "/contact-us"
// - Markup lives in contact-us.html (edit text/images there)
@Component({
  selector: 'app-contact-us',
  imports: [...PAGE_IMPORTS, ContactSection],
  templateUrl: './contact-us.html',
})
export class ContactUs {}
