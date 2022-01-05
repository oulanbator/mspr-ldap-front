import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwoFactorsService {
  twoFactorsEnabled: boolean = false;
  barCode: string = "";

  constructor() { }

}
