import { Component } from '@angular/core';
import { BaseCard } from '../../components/base-card/base-card';
import { CreateProject } from '../../components/create-project/create-project';
import { EditProject } from '../../components/edit-project/edit-project';
import { EditImages } from '../../components/edit-images/edit-images';

@Component({
  selector: 'app-projects',
  imports: [
    CreateProject,
    EditProject,
    EditImages,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

}
