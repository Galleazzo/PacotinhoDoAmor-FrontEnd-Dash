import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';
import { TablesDataService } from '../data.service';
import { AnimalsService } from '@shared/services/animals.service';

@Component({
  selector: 'app-animals',
  standalone: true,
  providers: [TablesDataService],
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MtxGridModule,
    PageHeaderComponent,
  ],
  templateUrl: './animals.component.html',
  styleUrl: './animals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalsComponent implements OnInit {

  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('animals_list_table.id'),
      field: 'id',
      sortable: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: this.translate.stream('animals_list_table.priority'),
      field: 'priority',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: this.translate.stream('animals_list_table.name'),
      field: 'name',
      minWidth: 100,
    },
    {
      header: this.translate.stream('animals_list_table.animalAge'),
      field: 'animalAge',
      minWidth: 100,
    },
    {
      header: this.translate.stream('animals_list_table.animalType'),
      field: 'animalType',
      minWidth: 100,
    },
    {
      header: this.translate.stream('animals_list_table.registrationDate'),
      field: 'registrationDate',
      hide: true,
      minWidth: 120,
    },
    {
      header: this.translate.stream('animals_list_table.operation'),
      field: 'operation',
      minWidth: 140,
      width: '140px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: this.translate.stream('animals_list_table.edit'),
          click: record => this.edit(record),
        },
        {
          type: 'icon',
          color: 'warn',
          icon: 'delete',
          tooltip: this.translate.stream('animals_list_table.delete'),
          pop: {
            title: this.translate.stream('animals_list_table.confirm_delete'),
            closeText: this.translate.stream('animals_list_table.close'),
            okText: this.translate.stream('animals_list_table.ok'),
          },
          click: record => this.delete(record),
        },
      ],
    },
  ];
  list: any[] = [];
  isLoading: any;

  multiSelectable = false;
  rowSelectable = false;
  hideRowSelectionCheckbox = false;
  showToolbar = true;
  columnHideable = false;
  columnSortable = false;
  columnPinnable = false;
  rowHover = true;
  rowStriped = true;
  showPaginator = true;
  expandable = false;
  columnResizable = false;

  constructor(
    private translate: TranslateService,
    private dataSrv: TablesDataService,
    private dialog: MtxDialog,
    private animalsService: AnimalsService
  ) { }

  ngOnInit() {
    this.search();
  }

  search() {
    this.isLoading = true; 

    this.animalsService.getAll().subscribe((response: any) => {
      this.list = response;
      this.isLoading = false;
    })
}


  edit(value: any) {
    const dialogRef = this.dialog.originalOpen(AnimalsComponent, {
      width: '600px',
      data: { record: value },
    });

    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }

  delete(value: any) {
    this.dialog.alert(`You have deleted ${value.position}!`);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }

  updateCell() {
    this.list = this.list.map(item => {
      item.weight = Math.round(Math.random() * 1000) / 100;
      return item;
    });
  }

  updateList() {
    this.list = this.list.splice(-1).concat(this.list);
  }
}