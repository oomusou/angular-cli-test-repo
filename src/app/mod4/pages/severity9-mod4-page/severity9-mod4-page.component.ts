﻿import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthService } from './../../../shared/services/auth.service';
import { HelperService } from './../../../shared/services/helper.service';
import { PageComponent } from './../../../shared/components/page/page.component';
import { Severity9Mod4GridComponent } from './components/severity9-mod4-grid/severity9-mod4-grid.component';
import { Severity9Mod4 } from './../../models/severity9-mod4';

import { Severity9Mod4Service } from './../../services/severity9-mod4.service';

@Component({
  selector: 'app-mod4-severity9-mod4-page',
  templateUrl: './severity9-mod4-page.component.html',
  providers: [
    Severity9Mod4Service
  ]
})
export class Severity9Mod4PageComponent extends PageComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public newRecord: boolean;
  public item: Severity9Mod4;

  @ViewChild('grid') grid: Severity9Mod4GridComponent;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    authService: AuthService,
    private helperService: HelperService,
    private severity9Mod4Service: Severity9Mod4Service) {
    super(router, authService);
  }

  ngOnInit() {
    super.checkPermission('mod4.severity9Mod4.select');
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.edit(id);
        } else if (id === '') {
          this.item = {} as Severity9Mod4;
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
    this.router.navigate(['/mod4/severity9-mod4', { id: '' }]);
  }

  private edit(id: number): void {
    this.grid.isLoading = true;
    this.newRecord = false;
    this.severity9Mod4Service
      .getById(id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(item => {
        this.item = item;
        this.grid.isLoading = false;
      });
  }

}
