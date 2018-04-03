import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CognitoService} from "../../aws/cognito.service";

@Component({
  selector: 'app-slide-upload',
  templateUrl: './slide-upload.component.html',
  styleUrls: ['./slide-upload.component.scss']
})
export class SlideUploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private cognitoService: CognitoService) { }

  uploadForm: FormGroup;
  loading: boolean = false;

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      slides: null,
      emailKey: '',
      description: ''
    })
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.uploadForm.get('slides').setValue(file);
    }
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('name', this.uploadForm.get('name').value);
    input.append('slides', this.uploadForm.get('slides').value);
    return input;
  }

  onSubmit() {
    // let uploadUrlRequest = {};
    // uploadUrlRequest.emailKey = this.uploadForm.get('emailKey');
    // uploadUrlRequest.description = this.uploadForm.get('description');
    //
    // let httpHeaders = new HttpHeaders();
    // this.http.post(environment.serviceURL+'/slides', uploadUrlRequest, {headers: httpHeaders});

    console.log(this.cognitoService.getCurrentUser());
    console.log(this.cognitoService.getUserPool());
    console.log(this.cognitoService.getCognitoCreds());
    console.log(this.cognitoService.getCognitoIdentity());
    this.cognitoService.getAccessToken().subscribe(result => console.log(result));
    this.cognitoService.getIdToken().subscribe(result => console.log(result));
    this.cognitoService.getRefreshToken().subscribe(result => console.log(result));

  }

  clearFile() {
    this.uploadForm.get('slides').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

}
