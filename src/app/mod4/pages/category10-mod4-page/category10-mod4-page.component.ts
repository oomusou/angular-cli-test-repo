﻿import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthService } from './../../../shared/services/auth.service';
import { HelperService } from './../../../shared/services/helper.service';
import { PageComponent } from './../../../shared/components/page/page.component';
import { Category10Mod4GridComponent } from './components/category10-mod4-grid/category10-mod4-grid.component';
import { Category10Mod4 } from './../../models/category10-mod4';

import { Category10Mod4Service } from './../../services/category10-mod4.service';

@Component({
  selector: 'app-mod4-category10-mod4-page',
  templateUrl: './category10-mod4-page.component.html',
  providers: [
    Category10Mod4Service
  ]
})
export class Category10Mod4PageComponent extends PageComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public newRecord: boolean;
  public item: Category10Mod4;

  @ViewChild('grid') grid: Category10Mod4GridComponent;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    authService: AuthService,
    private helperService: HelperService,
    private category10Mod4Service: Category10Mod4Service) {
    super(router, authService);
  }

  ngOnInit() {
    super.checkPermission('mod4.category10Mod4.select');
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.edit(id);
        } else if (id === '') {
          this.item = {} as Category10Mod4;
        } else {
          this.item = null;
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public new(): void {
    this.newRecord = true;
    this.router.navigate(['/mod4/category10-mod4', { id: '' }]);
  }

  private edit(id: number): void {
    this.grid.isLoading = true;
    this.newRecord = false;
    this.category10Mod4Service
      .getById(id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(item => {
        this.item = item;
        this.grid.isLoading = false;
      });
  }

}
