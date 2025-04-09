import { Component } from '@angular/core';
import { HeaderService } from '../services/header-service/header.service';
import { Header } from '../models/header/header.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  itemCount: number = 0;
  btnTxt: string = "Agregar";
  header: Header[] = [];
  myHeader: Header = new Header();
  selectedHeaderId: string | null = null;

  constructor(public headerService: HeaderService) {
    this.headerService.getHeader().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.header = data;
      console.log(this.header);
    });
  }

  AgregarHeader() {
    if (this.selectedHeaderId) {
      this.headerService.updateHeader(this.selectedHeaderId, this.myHeader).then(() => {
        this.resetForm();
        console.log('Updated header successfully!');
      });
    } else {
      this.headerService.createHeader(this.myHeader).then(() => {
        this.resetForm();
        console.log('Created new header successfully!');
      });
    }
  }

  deleteHeader(id?: string) {
    this.headerService.deleteHeader(id).then(() => {
      console.log('Deleted header successfully!');
    });
  }

  editHeader(header: any) {
    this.myHeader = { email: header.email, goalLife: header.goalLife, location: header.location, name: header.name,
                      phoneNumber: header.phoneNumber, photoUrl: header.photoUrl, socialNetwork: header.socialNetwork };
    this.selectedHeaderId = header.id;
    this.btnTxt = "Update";
  }

  resetForm() {
    this.myHeader = new Header();
    this.selectedHeaderId = null;
    this.btnTxt = "Agregar";
  }
}
