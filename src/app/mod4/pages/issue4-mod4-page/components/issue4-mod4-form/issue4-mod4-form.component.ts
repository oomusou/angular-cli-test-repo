﻿import { Component, ViewChild, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { CustomValidators } from 'ng2-validation';
import { AuthService } from './../../../../../shared/services/auth.service';
import { HelperService } from './../../../../../shared/services/helper.service';
import { SettingsService } from './../../../../../shared/services/settings.service';
import { FormComponent } from './../../../../../shared/components/form/form.component';

import { Project4Mod4Service } from './../../../../services/project4-mod4.service';
import { Category4Mod4Service } from './../../../../services/category4-mod4.service';
import { Status4Mod4Service } from './../../../../services/status4-mod4.service';
import { Severity4Mod4Service } from './../../../../services/severity4-mod4.service';
import { Issue4Mod4Service } from './../../../../services/issue4-mod4.service';
import { Issue4Mod4 } from './../../../../models/issue4-mod4';

@Component({
  selector: 'app-mod4-issue4-mod4-form',
  templateUrl: './issue4-mod4-form.component.html'
})
export class Issue4Mod4FormComponent extends FormComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public formGroup: FormGroup;

  @Input() newRecord: boolean;
  @Input() item: Issue4Mod4;

  @Output() gridRefreshEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    authService: AuthService,
    settingsService: SettingsService,
    private helperService: HelperService,
    private project4Mod4Service: Project4Mod4Service,
    private category4Mod4Service: Category4Mod4Service,
    private status4Mod4Service: Status4Mod4Service,
    private severity4Mod4Service: Severity4Mod4Service,
    private issue4Mod4Service: Issue4Mod4Service) {
    super(authService, settingsService);
  }

  ngOnInit() {
    this.loadSelects();
    this.buildFormGroup();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      issueId: [this.item.issueId, []],
      projectId: [super.toString(this.item.projectId), [Validators.required]],
      title: [this.item.title, [Validators.required]],
      categoryId: [super.toString(this.item.categoryId), [Validators.required]],
      statusId: [super.toString(this.item.statusId), [Validators.required]],
      severityId: [super.toString(this.item.severityId), [Validators.required]],
      description: [this.item.description, [Validators.required]]
    });
  }

  public back(): void {
    this.router.navigate(['/mod4/issue4-mod4']);
  }

  public save(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.isLoading = true;
      const item = this.formGroup.value;
      this.issue4Mod4Service
        .save(this.newRecord, item)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(result => {
          if (result.isValid) {
            this.helperService.message.success(result);
            this.gridRefreshEventEmitter.emit(null);
            setTimeout(() => { this.back(); }, 0);
          } else {
            this.helperService.message.error(result);
          }
          this.isLoading = false;
        });
    }
  }

  private loadSelects(): void {
    this.project4Mod4Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsProject4Mod4 = items;
      });

    this.category4Mod4Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsCategory4Mod4 = items;
      });

    this.status4Mod4Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsStatus4Mod4 = items;
      });

    this.severity4Mod4Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsSeverity4Mod4 = items;
      });
  }

}
