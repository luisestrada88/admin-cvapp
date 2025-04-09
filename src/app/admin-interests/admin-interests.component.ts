import { Component } from '@angular/core';
import { InterestsService } from '../services/interests-service/interests.service';
import { Interests } from '../models/interests/interests.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrls: ['./admin-interests.component.css']
})
export class AdminInterestsComponent {
  itemCount: number = 0;
  btnTxt: string = 'Agregar';
  interests: Interests[] = [];
  myInterest: Interests = new Interests();
  selectedInterestId: string | null = null;

  constructor(public interestsService: InterestsService) {
    this.interestsService.getInterests().snapshotChanges().pipe(
      map((changes: any[]) =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any[]) => {
      this.interests = data;
      console.log(this.interests);
    });
  }

  AgregarInterest() {
    if (this.selectedInterestId) {
     
      this.interestsService.updateInterests(this.selectedInterestId, this.myInterest).then(() => {
        this.resetForm();
        console.log('Updated interest successfully!');
      });
    } else {
      
      this.interestsService.createInterests(this.myInterest).then(() => {
        this.resetForm();
        console.log('Created new interest successfully!');
      });
    }
  }

  deleteInterests(id?: string) {
    this.interestsService.deleteInterests(id).then(() => {
      console.log('Deleted interest successfully!');
    });
  }

  editInterests(interest: any) {
    this.myInterest = { interests: interest.interests };  
    this.selectedInterestId = interest.id;
    this.btnTxt = 'Update';
  }

  resetForm() {
    this.myInterest = new Interests();
    this.selectedInterestId = null;
    this.btnTxt = 'Agregar';
  }
}
