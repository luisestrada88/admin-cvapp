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
  goalText: string = '';
  interests: Interests[] = [];
  myInterests: Interests = new Interests();

  constructor(public interestsService: InterestsService) {
    console.log(this.interestsService);
    this.interestsService.getInterests().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.interests = data;
      console.log(this.interests);
    });
  }

  AgregarInterest() {
    console.log(this.myInterests);
    this.interestsService.createInterests(this.myInterests).then(() => {
      console.log('Created new item successfully!');
    });
  }

  deleteInterest(id?: string) {
    this.interestsService.deleteInterests(id).then(() => {
      console.log('Delete item successfully!');
    });
    console.log(id);
  }
}
