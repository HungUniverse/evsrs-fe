import { api } from "@/lib/axios/axios";
import type {
  ApiResp,
  SendOtpRequest,
  VerifyOtpRequest,
  CompleteRegisterRequest,
  LoginRequest,
  LoginResponse,
} from "@/@types/auth.type";

const authAPI = {
  login: (body: LoginRequest) =>
    api.post<ApiResp<LoginResponse>>("/Auth/signin", body),
  sendOtp: (body: SendOtpRequest) =>
    api.post<ApiResp<null>>("/Auth/send-otp", body),

  verifyOtp: (body: VerifyOtpRequest) =>
    api.post<ApiResp<null>>("/Auth/verify-otp", body),
  completeRegister: (body: CompleteRegisterRequest) =>
    api.post<ApiResp<null>>("/Auth/complete-register", body),
};

export default authAPI;
