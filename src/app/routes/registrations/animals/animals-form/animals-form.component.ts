import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { PageHeaderComponent } from '@shared';
import { FileHandel, InputFieldType } from '@shared/components/input-formly-custom/formly-field-input';
import { AnimalsService } from '@shared/services/animals.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-animalsForm',
  templateUrl: './animals-form.component.html',
  styleUrls: ['./animals-form.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    FormlyModule,
    PageHeaderComponent,
    MatProgressBarModule
  ],
})
export class AnimalsFormComponent implements OnInit {


  animalForm: FormGroup = new FormGroup({});
  model: any;
  type: string = "";
  isLoading = true;
  finalFile: any = null;

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-sm-6',
          type: 'input',
          key: 'name',
          id: "name",
          templateOptions: {
            label: 'Nome',
            required: true,
          },
        },
        {
          className: 'col-sm-6',
          type: 'input',
          key: 'instagramURL',
          id: "instagramURL",
          templateOptions: {
            label: 'URL do instagram',
            required: false,
          }
        },
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-sm-4',
          type: 'select',
          key: 'animalAge',
          id: 'animalAge',
          templateOptions: {
            label: 'Idade',
            options: [
              { id: 0, name: 'BELOW_TWO_MONTHS', label: 'Menos que dois meses' },
              { id: 1, name: 'TWO_TO_SIX_MONTHS', label: 'De dois a seis meses' },
              { id: 2, name: 'SEVEN_TO_ELEVEN_MONTHS', label: 'De sete a onze meses' },
              { id: 3, name: 'ONE_YEARS', label: 'Um ano' },
              { id: 4, name: 'TWO_YEARS', label: 'Dois anos' },
              { id: 5, name: 'THREE_YEARS', label: 'Três anos' },
              { id: 6, name: 'FOUR_YEARS', label: 'Quatro anos' },
              { id: 7, name: 'FIVE_YEARS', label: 'Cinco anos' },
              { id: 8, name: 'MORE_SIX_YEARS', label: 'Mais de seis anos' },
            ],
            labelProp: 'label',
            valueProp: 'name',
            required: true,
          },
        },
        {
          className: 'col-sm-4',
          type: 'select',
          key: 'animalType',
          id: 'animalType',
          templateOptions: {
            label: 'Tipo',
            options: [
              { id: 0, name: 'DOG', label: 'Cachorro' },
              { id: 1, name: 'CAT', label: 'Gato' },
            ],

            labelProp: 'label',
            valueProp: 'name',
            required: true,
          },
        },
        {
          className: 'col-sm-4',
          type: 'select',
          key: 'size',
          id: 'size',
          templateOptions: {
            label: 'Tamanho',
            options: [
              { id: 0, name: 'SMALL', label: 'Pequeno' },
              { id: 1, name: 'AVERAGE', label: 'Médio' },
              { id: 2, name: 'BIG', label: 'Grande' },
            ],
            labelProp: 'label',
            valueProp: 'name',
            required: true,
          },
        },
      ],
    },
    {
      type: 'textarea',
      key: 'description',
      id: 'description',
      templateOptions: {
        label: 'Descrição',
        rows: 5
      },
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-sm-4',
          type: 'select',
          key: 'animalSex',
          id: 'animalSex',
          templateOptions: {
            label: 'Sexo',
            options: [
              { id: 0, name: 'MALE', label: 'Macho' },
              { id: 1, name: 'FEMALE', label: 'Femea' },
            ],
            labelProp: 'label',
            valueProp: 'name',
            required: true,
          },
        },
        {
          className: 'col-sm-4',
          type: 'input',
          key: 'race',
          id: 'race',
          templateOptions: {
            label: 'Raça',
            required: true,
          },
        },
        {
          className: 'col-sm-4',
          type: 'input',
          key: 'priority',
          id: 'priority',
          templateOptions: {
            type: 'number',
            label: 'Prioridade',
            max: 10,
            min: 0,
            required: true
          },
        },
      ],
    },
    {
      type: InputFieldType,
      key: 'animalImage',
      id: "animalImage"
    },
  ];

  constructor(private toast: ToastrService,
    private animalService: AnimalsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private inputField: InputFieldType,
    private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.type = this.route.snapshot.url[1].path;
    this.createForm(null)

    if (this.type === "edit") {
      let id = this.route.snapshot.url[2].path;
      this.getAnimal(id);
    }
    if (this.type === "new") {
      this.createForm(null)
      this.isLoading = false;
    }
  }

  createForm(data: any) {
    this.animalForm = this.formBuilder.group({
      id: [data ? data.id : null],
      name: [data ? data.name : ""],
      instagramURL: [data ? data.instagramURL : ""],
      animalAge: [data ? this.selectAnimalAge(data.animalAge) : null],
      animalType: [data ? this.selectAnimalType(data.animalType) : null],
      race: [data ? data.race : ""],
      size: [data ? this.selectAnimalSize(data.size) : null],
      description: [data ? data.description : ""],
      animalSex: [data ? this.selectAnimalSex(data.animalSex) : null],
      registrationDate: [data ? data.registrationDate : ""],
      priority: [data ? data.priority : 0],
      animalImage: [data ? data.animalImage : null]
    })
    console.log(this.animalForm);
    
  }

  submit() {
    const animalForm = this.prepareFormData(this.animalForm.value);

    this.animalService.save(animalForm).subscribe((response: any) => {
      return this.router.navigate(['/registrations/animals']);
    })
  }

  getAnimal(id: any) {
    this.isLoading = true
    this.animalService.getById(id).subscribe((result: any) => {
      this.model = result;
      this.createForm(result)
      this.isLoading = false;
    })
  }

  showToast(obj: any) {
    this.toast.success(JSON.stringify(obj));
  }

  cancel() {
    return this.router.navigate(['/registrations/animals']);
  }

  selectAnimalAge(animalAge: any): number {
    if (animalAge == "BELOW_TWO_MONTHS") {
      return 0;
    }
    if (animalAge == "TWO_TO_SIX_MONTHS") {
      return 1;
    }
    if (animalAge == "SEVEN_TO_ELEVEN_MONTHS") {
      return 2;
    }
    if (animalAge == "ONE_YEARS") {
      return 3;
    }
    if (animalAge == "TWO_YEARS") {
      return 4;
    }
    if (animalAge == "THREE_YEARS") {
      return 5;
    }
    if (animalAge == "FOUR_YEARS") {
      return 6;
    }
    if (animalAge == "FIVE_YEARS") {
      return 7;
    }
    if (animalAge == "MORE_SIX_YEARS") {
      return 8;
    }
    throw new Error();
  }

  selectAnimalType(animalType: any): number {
    if (animalType == "DOG") {
      return 0;
    }
    if (animalType == "CAT") {
      return 1;
    }
    throw new Error();
  }

  selectAnimalSex(animalSex: any): number {
    if (animalSex == "MALE") {
      return 0;
    }
    if (animalSex == "FEMALE") {
      return 1;
    }
    throw new Error();
  }

  selectAnimalSize(animalSize: string): number {
    if (animalSize == "SMALL") {
      return 0;
    }
    if (animalSize == "AVERAGE") {
      return 1;
    }
    if (animalSize == "BIG") {
      return 2;
    }
    throw new Error();
  }

  prepareFormData(animal: any): FormData {
    const formData = new FormData();
    var finalAnimal = {
      id: animal.id,
      name: animal.name,
      instagramURL: animal.instagramURL,
      animalAge: animal.animalAge,
      animalType: animal.animalType,
      race: animal.race,
      size: animal.size,
      animalSex: animal.animalSex,
      priority: animal.priority,
      description: animal.description,
      registrationDate: null
    }

    formData.append(
      'animal',
      new Blob([JSON.stringify(finalAnimal)], { type: 'application/json' })
    );

    var finalImage = this.inputField.finalValue;
    if(finalImage != null) {
      formData.append(
        'imageFile',
        finalImage.file,
        finalImage.file.name
      );
    }

    return formData;
  }
}