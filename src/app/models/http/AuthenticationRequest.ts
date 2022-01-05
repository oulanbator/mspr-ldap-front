export interface AuthenticationRequest {
  username: string;
  password: string;
  twoFactorsTotp: string;
}
