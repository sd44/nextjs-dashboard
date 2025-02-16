import { Inter, Lusitana, Noto_Sans_SC } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const lusitana = Lusitana({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const noto_sans_sc = Noto_Sans_SC({
    weight: ['400', '700'], // 指定需要的权重
    subsets: ["chinese-simplified"],
    display: 'swap' // <-- here
});

// import localFont from "next/font/local";

// const myFont = localFont({
//   src: "../public/fonts/MyCustomFont.woff2",
//   weight: "400",
//   style: "normal",
//   variable: "--font-myfont",
// });
