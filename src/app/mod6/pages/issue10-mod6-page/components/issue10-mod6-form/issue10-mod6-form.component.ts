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

import { Project10Mod6Service } from './../../../../services/project10-mod6.service';
import { Category10Mod6Service } from './../../../../services/category10-mod6.service';
import { Status10Mod6Service } from './../../../../services/status10-mod6.service';
import { Severity10Mod6Service } from './../../../../services/severity10-mod6.service';
import { Issue10Mod6Service } from './../../../../services/issue10-mod6.service';
import { Issue10Mod6 } from './../../../../models/issue10-mod6';

@Component({
  selector: 'app-mod6-issue10-mod6-form',
  templateUrl: './issue10-mod6-form.component.html'
})
export class Issue10Mod6FormComponent extends FormComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public formGroup: FormGroup;

  @Input() newRecord: boolean;
  @Input() item: Issue10Mod6;

  @Output() gridRefreshEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    authService: AuthService,
    settingsService: SettingsService,
    private helperService: HelperService,
    private project10Mod6Service: Project10Mod6Service,
    private category10Mod6Service: Category10Mod6Service,
    private status10Mod6Service: Status10Mod6Service,
    private severity10Mod6Service: Severity10Mod6Service,
    private issue10Mod6Service: Issue10Mod6Service) {
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
    this.router.navigate(['/mod6/issue10-mod6']);
  }

  public save(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.isLoading = true;
      const item = this.formGroup.value;
      this.issue10Mod6Service
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
    this.project10Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsProject10Mod6 = items;
      });

    this.category10Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsCategory10Mod6 = items;
      });

    this.status10Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsStatus10Mod6 = items;
      });

    this.severity10Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsSeverity10Mod6 = items;
      });
  }

}
