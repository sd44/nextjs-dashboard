import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { jwtDecode } from "jwt-decode";

const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5ODgzMzkxLCJpYXQiOjE3Mzk4Nzk3OTEsImp0aSI6IjBlM2ZmOWI5NTA3MzQxNDA5ZDlmNDU2ODEwNWI4YmMxIiwidXNlcl9pZCI6MX0.HRSlMookvwTgIFlaH5dcxHvjRiJDemYh0jr0yVz1Omfq2KtvCznAL99F9gLpE2JxjUF-10zfWD8sfUcGXn0vnK5BjiZveIlordfrP0frFfMxZy_mi2aDu5RTDQLM4k-Jt-rEpY2w1dqRTZmYqiicB_S7al9WwFW_KlawXDjV746bQ61cYH4zj0ldWi5mobsCqmpzT92_x_MkDS0QwEag2boizO5UhocnMuK2CuGjzjsA7iez-0gRMOQtytVyzHmc5CX-Tj0wovGGv4kxfD9_qLOcUqSKFfmqF3iKvxNdCHXIgjGtxhW30PAygt40CLo5r7dHCNrxUKZJHiDN1MNB9w";
const refresh = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0MTE3NTc5MSwiaWF0IjoxNzM5ODc5NzkxLCJqdGkiOiIxMDQxZTc5M2Q0ODc0ZTQ2ODQwYTVlNDk5NTU3YzRlYyIsInVzZXJfaWQiOjF9.QSlhcc_zdxaIVRATQJ7rVbplIMUhIjjJXt46tTexjDvJPgbTD0g8v_TLzJ5uM5e9FpN15KvFC41pzS4eJjp08wwwKKpyqq4P8WoHSynOotnKJjdQNyx5k4IkGjUBEgPT6vl500bEB1YlNszZW4uEcN8MSPSRyOMTigQpbn0rGkbBeOk4rFWWCCkr_rXCRSdtFOJOCLoJQcPZXIpo_MVwVENO9WY7XLn8Rl199BPgae9NeJCEsj7YAmMe0wC08c1UOM7wjxYOcfVoZu5QYdXaelJxEkpu_ngTutKibx-gAlR6aNd0BqPE3l0YNT6Co4EdhMqjmVUi7-HGWdSQ5Uliig"

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
        <p> {JSON.stringify(jwtDecode(token))}</p>
        <p> {JSON.stringify(jwtDecode(refresh))}</p>
      </div>
    </main>
  );
}
