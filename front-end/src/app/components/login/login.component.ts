import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

import { PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup } from '@angular/router';
// import { AngularMaterialModule } from '../../core/angular-material.module';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  public form: FormGroup = this.fb.group({
    user_number: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.minLength(8)]),
    password: this.fb.control('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private dialog: MatDialog) {
    const urlTree = this.router.parseUrl(this.router.url);
    const segmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    const urlSegments: UrlSegment[] = segmentGroup.segments;


  }

  public async ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate['']
    }
  }

  public async onClick() {
    try {
      await this.authService.login(this.form.get('user_number').value, this.form.get('password').value);
    } catch (err) {
      this.openErrorDialog()
    }
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

}
