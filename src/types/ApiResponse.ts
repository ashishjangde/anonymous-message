

export default interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
  isAcceptingMessages?: boolean;
}
