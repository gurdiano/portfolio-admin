import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, input } from '@angular/core';

export interface SuccessResponseBody {
  mesage: string,
  response: any,
}
export interface ErrorResponseBody {
  mesage: string,
  error: HttpErrorResponse | any
}

@Component({
  selector: 'app-response-msg',
  imports: [],
  templateUrl: './response-msg.html',
  styleUrl: './response-msg.css',
})
export class ResponseMsg {
  successResponse = false;
  errorResponse = false;
  msgResponse = '';

  success = input.required<SuccessResponseBody | null>();
  error = input.required<ErrorResponseBody | null >();
  reset = input(false);

  constructor () {
    // success
    effect(() => {
      const successValue = this.success();
      if (successValue != null) {
        const msg = successValue.mesage;
        const res = successValue.response;

        this._setSucessResponse(msg, res);
      }
    });
    // error
    effect(() => {
      const errorValue = this.error();

      if (errorValue) {
        const msg = errorValue.mesage;
        const res = errorValue.error;

        this._setErrorResponse(msg, res);
      }
    });
    // reset 
    effect(() => {
      if(this.reset()) {
        this.onReset();
      }
    });
  }

  private onReset(): void {
    this.successResponse = false;
    this.errorResponse = false;
  }

  private _setSucessResponse(mesage: string, response: any){
    this.successResponse = true;
    this.errorResponse = false;
    this.msgResponse = `Success: ${mesage}, API response: "${response}."`;
  }

  private _setErrorResponse(mesage: string, response: HttpErrorResponse | any){
    this.successResponse = false;
    this.errorResponse = true;
    const name = response.error?.errors?.Name;
    this.msgResponse = `Error: ${response.status} ${response.statusText}. ${mesage}, ${name? name : '...'}`;
  }
}
