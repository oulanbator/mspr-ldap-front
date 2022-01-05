export interface StandardApiResponse {
  status: string;
  statusCode: number;
  message: string;
  data: object[] | null;
}
