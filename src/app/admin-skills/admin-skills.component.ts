import { Component } from '@angular/core';
import { SkillsService } from '../services/skills-service/skills.service';
import { Skills } from '../models/skills/skills.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.css']
})
export class AdminSkillsComponent {
  itemCount: number = 0;
  buttonText: string = 'Agregar';
  goalText: string = '';
  skills: Skills[] = [];
  mySkill: Skills = new Skills();
  selectedSkillId: string | null = null;

  constructor(public skillsService: SkillsService) {
    console.log(this.skillsService);
    this.skillsService.getSkills().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.skills = data;
      console.log(this.skills);
    });
  }

  AgregarSkill() {
    console.log(this.mySkill);
    this.skillsService.createSkill(this.mySkill).then(() => {
      console.log('Created new skill successfully!');
      this.mySkill = new Skills();
    });
  }

  deleteSkill(id?: string) {
    this.skillsService.deleteSkill(id).then(() => {
      console.log('Deleted skill successfully!');
    });
    console.log(id);
  }

  updateSkill() {
    if (this.selectedSkillId) {
      this.skillsService.updateSkill(this.selectedSkillId, this.mySkill).then(() => {
        console.log('Updated skill successfully!');
        this.mySkill = new Skills();
        this.selectedSkillId = null;
      });
    } else {
      console.warn('No skill selected for update.');
    }
  }

  editSkill(skill: any) {
    this.mySkill = { ...skill };
    this.selectedSkillId = skill.id;
    console.log('Editing skill:', skill);
  }
}
