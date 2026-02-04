import { Component } from '@angular/core';
import { AddSkills } from '../../components/add-skills/add-skills';
import { CurrentSkills } from '../../components/current-skills/current-skills';
import { CreateTechnologies } from '../../components/create-technologies/create-technologies';
import { RemoveSkills } from '../../components/remove-skills/remove-skills';
import { LinkSkills } from '../../components/link-skills/link-skills';

@Component({
  selector: 'app-skills',
  imports: [
    AddSkills,
    CurrentSkills,
    CreateTechnologies,
    RemoveSkills,
    LinkSkills,
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {

}
