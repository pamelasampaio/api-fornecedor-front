import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { PeriodicElement } from 'src/app/modules/PeriodicElement';
import { PeriodicElementService } from 'src/app/services/periodicElement.service';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PeriodicElementService]
})
export class HomeComponent {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = ['id', 'nome', 'CNPJ', 'mercadoria', 'telefone', 'email', 'Editar/Excluir'];
  dataSource!: PeriodicElement[];

  constructor(
    public dialog: MatDialog,
    public periodicElementService: PeriodicElementService
    ) {
      this.periodicElementService.getElements()
      .subscribe((data: PeriodicElement[]) => {
        this.dataSource = data;
      });
    }

  ngOnInit(): void {
  }

  openDialog(element: PeriodicElement | null): void {
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '250px',
      data: element === null ? {
        id: null,
        nome: '',
        CNPJ: null,
        mercadoria: null,
        telefone: null,
        email: '',
      } : {
        id: element.id,
        nome: element.nome,
        CNPJ: element.CNPJ,
        mercadoria: element.mercadoria,
        telefone: element.telefone,
        email: element.email,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log(result);
        if (this.dataSource.map(p => p.id).includes(result.id)) {
          this.periodicElementService.editElement(result)
          .subscribe((data: PeriodicElement) => {
            const index = this.dataSource.findIndex(p => p.id === data.id);
          this.dataSource[index] = data;
          this.table.renderRows();
          });
        } else {
          this.periodicElementService.createElements(result)
          .subscribe((data: PeriodicElement) => {
          this.dataSource.push(data);
          this.table.renderRows();
          });
          
        }
      }
    }); 
  }

  editElement(element: PeriodicElement): void {
    this.openDialog(element);
  }

  deleteElement(id: number): void {
    this.periodicElementService.deleteElement(id)
    .subscribe(() => {
    this.dataSource = this.dataSource.filter(p => p.id !== id);
    });
  }
}