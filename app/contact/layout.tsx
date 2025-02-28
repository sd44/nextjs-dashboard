import SideNavBar from '@/app/ui/contact/sidenavbar';

/* export const experimental_ppr = true; */

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen flex-col md:overflow-hidden">
        <SideNavBar children={children}/>
    </div>
  );
}
