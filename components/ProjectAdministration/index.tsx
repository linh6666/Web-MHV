'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import {
  IconGauge,
  IconNotes,
  IconUser,
} from '@tabler/icons-react';
import { ScrollArea, Drawer, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LinksGroup } from './NavbarLinksGroup/NavbarLinksGroup';
import classes from './NavbarSimple.module.css';
import Project from './Project'; 
import JionProject from './JionProject'; 
import System from './System'; 
import User from './User'; 
import Roles from './Roles'; 
import UserProjectRole from './UserProjectRole';
import Order from './Order'; 
import  ProjectDetails from './ProjectDetails';
import HomeAdmin from '../HomeAdmin/index';  

const mockdata = [
  { label: 'Báo cáo tổng quan', icon: IconGauge, link: 'home' },
   {
    label: 'Quản trị hệ thống',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Định danh trong vai trò hệ thống', link: 'System' },
       { label: 'Phân Quyền người dùng trong hệ thống', link: 'User' },
     
    ],
  },

 {
    label: 'Quản trị dự án',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Danh sách dự án', link: 'project' },
         { label: 'Cập nhật sản phẩm', link: 'projectdetails' },
      
      { label: 'Định danh vai trò người trong dự án', link: 'Roles' },
       { label: 'Phân quyền người dùng trong dự án', link: 'UserProjectRole' },
     
    ],
  },
  {
    label: 'Phân quyền người dùng trong dự án',
    icon: IconUser,
    initiallyOpened: true,
    links: [
      { label: 'Quản lý người dùng vào dự án', link: 'JionProject' },
      { label: 'Quản lý đơn hàng', link: 'Order' },
      { label: 'Duyệt đơn thanh toán kế tiếp', link: 'Test1' },
      
    ],
  },
];



export function ProjectManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  // Lấy giá trị active từ url query parameter (ví dụ: ?tab=project)
  const active = searchParams.get('tab') || 'home';

  // Tự động thêm ?tab=home vào URL nếu chưa có
  useEffect(() => {
    if (!searchParams.get('tab')) {
      router.replace(`${pathname}?tab=home`);
    }
  }, [pathname, searchParams, router]);

  const handleActiveChange = (value: string) => {
    // Nếu value là đường dẫn riêng thực sự, điều hướng trực tiếp
    if (value.startsWith('http')) {
      window.location.href = value;
    } else if (value.startsWith('/')) {
      router.push(value);
    } else {
      router.push(`${pathname}?tab=${value}`);
    }
    close(); // Tự động đóng menu trên thiết bị di động sau khi chọn
  };

  const combinedData = [...mockdata, ];

  // Hàm render nội dung tương ứng với menu
  const renderContent = () => {
    switch (active) {
       case 'System':
              return <System/>;
               case 'User':
                      return <User/>;

      case 'project':
        return <Project/>;
          case 'UserProjectRole':
                return <UserProjectRole/>;
           case 'Roles':
                return <Roles/>;
      case 'Order':
        return <Order/>;
      case 'permission':
        return <div>Đây là trang dự án</div>;
      case 'project-list':
        return <div>Đây là trang dự án</div>;
           case 'projectdetails':
        return <ProjectDetails />;
      case 'JionProject':
       return <JionProject/>;
         
      case 'home':
        return <HomeAdmin />;
      default:
         return <HomeAdmin/>;
    }
  };

  const navLinks = combinedData.slice(0, mockdata.length).map((item) => (
    <LinksGroup
      {...item}
      key={item.label}
      active={active}
      onActiveChange={handleActiveChange} // truyền hàm để đổi nội dung khi click và cập nhật url
    />
  ));

  return (
    <div className={classes.container}>
      {/* Mobile Header */}
      <div className={classes.mobileHeader}>
        <Burger opened={opened} onClick={toggle} size="sm" />
        <h3>QUẢN TRỊ DỰ ÁN</h3>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Menu"
        padding="md"
        size="sm"
        zIndex={100}
      >
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>
            {navLinks}
          </div>
        </ScrollArea>
      </Drawer>

      {/* Sidebar (Desktop) */}
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <h3>QUẢN TRỊ DỰ ÁN</h3>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>
            {navLinks}
          </div>
        </ScrollArea>
      </nav>

      {/* Phần nội dung hiển thị bên phải */}
      <div className={`${classes.content} ${classes.hidescrollbar}`}>
        {renderContent()}
      </div>
    </div>
  );
}

export function ProjectManagement() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectManagementContent />
    </Suspense>
  );
}
