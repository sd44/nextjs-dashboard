import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { axiosInstance, requestRefresh, login } from './api';
import { applyAuthTokenInterceptor, getAccessToken, getRefreshToken} from 'axios-jwt';


export default async function LoginPage() {
  applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,  // async function that takes a refreshToken and returns a promise the resolves in a fresh accessToken
  })

  await login({ email: '25931014@qq.com', password: 'whopawho' });

  const accessToken = await getAccessToken();
  console.log(accessToken);

  const refreshToken= await getRefreshToken();
  console.log(refreshToken);

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
