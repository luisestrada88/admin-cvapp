import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-service/certificates.service';
import { Certificates } from '../models/certificates/certificates.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrls: ['./admin-certificates.component.css']
})
export class AdminCertificatesComponent {
  itemCount: number = 0;
  btnTxt: string = 'Agregar';
  certificates: Certificates[] = [];
  myCertificates: Certificates = new Certificates();
  selectedCertificateId: string | null = null;

  constructor(public certificatesService: CertificatesService) {
    console.log(this.certificatesService);
    this.certificatesService.getCertificates().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.certificates = data;
      console.log(this.certificates);
    });
  }

  AgregarCertificates() {
    if (this.selectedCertificateId) {
      this.certificatesService.updateCertificates(this.selectedCertificateId, this.myCertificates).then(() => {
        this.resetForm();
        console.log('Updated certificate successfully!');
      });
    } else {
      this.certificatesService.createCertificates(this.myCertificates).then(() => {
        this.resetForm();
        console.log('Created new certificate successfully!');
      });
    }
  }

  deleteCertificates(id?: string) {
    this.certificatesService.deleteCertificates(id).then(() => {
      console.log('Deleted certificate successfully!');
    });
  }

  editCertificates(certificates: any) {
    this.myCertificates = {
      name: certificates.name,
      year: certificates.year,
    };
    this.selectedCertificateId = certificates.id;
    this.btnTxt = 'Update';
  }

  resetForm() {
    this.myCertificates = new Certificates();
    this.selectedCertificateId = null;
    this.btnTxt = 'Agregar';
  }
}
