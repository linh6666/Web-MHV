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
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import classes from './NavbarSimple.module.css';
import User from './User';
import Roles from './Roles';
import System from './System';
import Permission from './Permission';
import Project from './Project';
import RolePermission from './RolePermission';
import SystemPermission from './SystemPermission';
import Attributes from './Attributes';
import ProjectTemplates from './ProjectTemplates';
import UserProjectRole from './UserProjectRole';
import TemplateAttributesLink from './TemplateAttributesLink';
import NodeAttribute from './NodeAttribute';
import HomeAdmin from '../HomeAdmin/index';
import ImportData from './ImportData'

const mockdata = [
  { label: 'BÁO CÁO TỔNG QUAN', icon: IconGauge, link: 'home' },
  {
    label: 'CẤU HÌNH HỆ THỐNG',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Cấu hình chức năng trong hệ thống', link: 'permission' },
      { label: 'Định danh vai trò trong hệ thống', link: 'System' },
      { label: 'Cấu hình vai trò trong hệ thống', link: 'SystemPermission' },
      { label: 'Phân quyền người dùng trong hệ thống', link: 'User' },
    ],
  },
  {
    label: 'CẤU HÌNH DỰ ÁN',
    icon: IconUser,
    initiallyOpened: true,
    links: [
      { label: 'Cấu hình chức năng trong dự án', link: 'permissions' },
      { label: 'Định danh vai trò trong dự án', link: 'Roles' },
      { label: 'Cấu hình vai trò trong dự án', link: 'RolePermission' },
      { label: 'Phân quyền người dùng trong dự án', link: 'UserProjectRole' },
    ],
  },
  {
    label: 'DỰ ÁN',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Cấu hình loại thuộc tính', link: 'Attributes' },
      { label: 'Định danh loại dự án', link: 'Project_Templates' },
      { label: 'Cấu hình loại dự án', link: 'Template_Attributes_Link' },
      { label: 'Danh sách dự án', link: 'project' },
      { label: 'Tạo dữ liệu điều khiển', link: 'Node_Attribute' },
        { label: 'Tải dữ liệu ', link: 'Import_Data' },
    ],
  },
];

export function PageAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  // Lấy giá trị active từ URL query parameter (ví dụ: ?tab=System)
  const active = searchParams.get('tab') || 'home';

  // Tự động thêm ?tab=home vào URL nếu chưa có
  useEffect(() => {
    if (!searchParams.get('tab')) {
      router.replace(`${pathname}?tab=home`);
    }
  }, [pathname, searchParams, router]);

  const handleActiveChange = (value: string) => {
    if (value.startsWith('http')) {
      window.location.href = value;
    } else if (value.startsWith('/')) {
      router.push(value);
    } else {
      router.push(`${pathname}?tab=${value}`);
    }
    close(); // Đóng menu mobile sau khi chọn
  };

  // Hàm render nội dung tương ứng với menu
  const renderContent = () => {
    switch (active) {
      case 'System':
        return <System />;
      case 'Roles':
        return <Roles />;
      case 'User':
        return <User />;
      case 'permission':
        return <Permission />;
           case 'permissions':
        return <Permission />;
      case 'RolePermission':
        return <RolePermission />;
      case 'SystemPermission':
        return <SystemPermission />;
      case 'UserProjectRole':
        return <UserProjectRole />;
      case 'Attributes':
        return <Attributes />;
      case 'Project_Templates':
        return <ProjectTemplates />;
      case 'Template_Attributes_Link':
        return <TemplateAttributesLink />;
      case 'project':
        return <Project />;
      case 'Node_Attribute':
        return <NodeAttribute />;
          case 'Import_Data':
        return <ImportData/>
      case 'home':
        return <HomeAdmin />;
      default:
        return <HomeAdmin />;
    }
  };

  const navLinks = mockdata.map((item) => (
    <LinksGroup
      {...item}
      key={item.label}
      active={active}
      onActiveChange={handleActiveChange}
    />
  ));

  return (
    <div className={classes.container}>
      {/* Mobile Header */}
      <div className={classes.mobileHeader}>
        <Burger opened={opened} onClick={toggle} size="sm" />
        <h3>QUẢN TRỊ HỆ THỐNG</h3>
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
          <h3>QUẢN TRỊ HỆ THỐNG</h3>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>
            {navLinks}
          </div>
        </ScrollArea>
      </nav>

      {/* Nội dung hiển thị bên phải */}
      <div className={`${classes.content} ${classes.hidescrollbar}`}>
        {renderContent()}
      </div>
    </div>
  );
}

export default function PageAdmin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageAdminContent />
    </Suspense>
  );
}
