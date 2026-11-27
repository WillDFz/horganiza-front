import IconRenderer from '../../IconRenderer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: string;
}

const SidebarItem = ({ label, href, icon }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <div className={`flex items-center gap-2 rounded-md p-2 ${isActive ? 'bg-primary-900/30' : 'hover:bg-surface-muted'}`}>
      <Link href={href} className={`flex items-center gap-2 ${isActive ? 'text-primary-dark' : 'text-muted-foreground'}`}>
        <IconRenderer icon={icon} color={isActive ? 'primary' : 'gray-500'} size='24px' />
        <span className='text-sm font-medium'>{label}</span>
      </Link>
    </div>
  );
};

export default SidebarItem;
