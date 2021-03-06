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

import { Project2Mod6Service } from './../../../../services/project2-mod6.service';
import { Category2Mod6Service } from './../../../../services/category2-mod6.service';
import { Status2Mod6Service } from './../../../../services/status2-mod6.service';
import { Severity2Mod6Service } from './../../../../services/severity2-mod6.service';
import { Issue2Mod6Service } from './../../../../services/issue2-mod6.service';
import { Issue2Mod6 } from './../../../../models/issue2-mod6';

@Component({
  selector: 'app-mod6-issue2-mod6-form',
  templateUrl: './issue2-mod6-form.component.html'
})
export class Issue2Mod6FormComponent extends FormComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public formGroup: FormGroup;

  @Input() newRecord: boolean;
  @Input() item: Issue2Mod6;

  @Output() gridRefreshEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    authService: AuthService,
    settingsService: SettingsService,
    private helperService: HelperService,
    private project2Mod6Service: Project2Mod6Service,
    private category2Mod6Service: Category2Mod6Service,
    private status2Mod6Service: Status2Mod6Service,
    private severity2Mod6Service: Severity2Mod6Service,
    private issue2Mod6Service: Issue2Mod6Service) {
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
    this.router.navigate(['/mod6/issue2-mod6']);
  }

  public save(): void {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.isLoading = true;
      const item = this.formGroup.value;
      this.issue2Mod6Service
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
    this.project2Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsProject2Mod6 = items;
      });

    this.category2Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsCategory2Mod6 = items;
      });

    this.status2Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsStatus2Mod6 = items;
      });

    this.severity2Mod6Service
      .getSelectList()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.selects.itemsSeverity2Mod6 = items;
      });
  }

}
