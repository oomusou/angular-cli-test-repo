﻿import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthService } from './../../../shared/services/auth.service';
import { HelperService } from './../../../shared/services/helper.service';
import { PageComponent } from './../../../shared/components/page/page.component';
import { Status7Mod10GridComponent } from './components/status7-mod10-grid/status7-mod10-grid.component';
import { Status7Mod10 } from './../../models/status7-mod10';

import { Status7Mod10Service } from './../../services/status7-mod10.service';

@Component({
  selector: 'app-mod10-status7-mod10-page',
  templateUrl: './status7-mod10-page.component.html',
  providers: [
    Status7Mod10Service
  ]
})
export class Status7Mod10PageComponent extends PageComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public newRecord: boolean;
  public item: Status7Mod10;

  @ViewChild('grid') grid: Status7Mod10GridComponent;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    authService: AuthService,
    private helperService: HelperService,
    private status7Mod10Service: Status7Mod10Service) {
    super(router, authService);
  }

  ngOnInit() {
    super.checkPermission('mod10.status7Mod10.select');
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.edit(id);
        } else if (id === '') {
          this.item = {} as Status7Mod10;
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
    this.router.navigate(['/mod10/status7-mod10', { id: '' }]);
  }

  private edit(id: number): void {
    this.grid.isLoading = true;
    this.newRecord = false;
    this.status7Mod10Service
      .getById(id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(item => {
        this.item = item;
        this.grid.isLoading = false;
      });
  }

}
