import { Inter, Lusitana } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});


// import localFont from "next/font/local";

// const myFont = localFont({
//   src: "../public/fonts/MyCustomFont.woff2",
//   weight: "400",
//   style: "normal",
//   variable: "--font-myfont",
// });
