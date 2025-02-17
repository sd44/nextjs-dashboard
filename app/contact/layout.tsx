import SideNavBar from '@/app/ui/contact/sidenavbar';
import NavBar from '@/app/ui/contact/nav';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen flex-col md:flex-col md:overflow-hidden">
      <div className="w-64">
        <SideNavBar children={children}/>
      </div>

    </div>
  );
}
