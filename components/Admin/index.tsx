'use client';
import { useState } from 'react';
import {
  IconGauge,
  IconNotes,
  IconUser,
} from '@tabler/icons-react';
import { ScrollArea } from '@mantine/core';
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

const mockdata = [
  { label: 'Báo cáo tổng quan', icon: IconGauge, link: 'home' },
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
       { label: 'Cấu hình chức năng trong dự án', link: 'tesst' },
      { label: 'Định danh vai trò trong dự án', link: 'Roles' },
      { label: 'Cấu hình vai trò trong dự án', link: 'RolePermission' },
      { label: 'Phân quyền người dùng trong dự án', link: 'UserProjectRole' },
      // { label: 'Quản lý RolePermission', link: 'user_project_role' },
      // { label: 'Yều cầu SystemPermission ', link: 'join_project' },
    ],
  },
    {
    label: 'DỰ ÁN',
    icon: IconNotes,
    initiallyOpened: true,
    links: [{ label: 'Cấu hình loại thuộc tính', link: 'Attributes' },
      { label: 'Định danh loại dự án', link: 'Project_Templates' },
      { label: 'Cấu hình loại dự án', link: 'Template_Attributes_Link' },
      { label: 'Danh sách dự án', link: 'project' },
      { label: 'Tạo dữ liệu điều khiển ', link: 'Node_Attribute' },
    ],
  },
];



export default function PageAdmin() {
  const [active, setActive] = useState<string>(''); // <-- thêm state để xử lý active

  const combinedData = [...mockdata];

  // Hàm render nội dung tương ứng với menu
  const renderContent = () => {
    switch (active) {
      case 'System':
        return <System/>;
      case 'Roles':
        return <Roles/>;
      case 'User':
        return <User/>;
      case 'permission':
        return <Permission/>;
      case 'system_permission':
        return <h1>xin chòa</h1>
        // <Projects/>;
      case 'RolePermission':
        return <RolePermission/>;
          case 'SystemPermission':
        return <SystemPermission/>;
          case 'UserProjectRole':
        return <UserProjectRole/>;
         case 'Attributes':
        return <Attributes/>;
         case 'Project_Templates':
        return <ProjectTemplates/>;
         case 'Template_Attributes_Link':
        return <TemplateAttributesLink/>
         case 'project':
        return <Project/>;
         case 'Node_Attribute':
        return <NodeAttribute/>
         
      default:
        return <HomeAdmin/>;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1260px',
        margin: '0px auto 10px auto',
        border:
          '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
      }}
    >
      {/* Sidebar */}
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <h3>QUẢN TRỊ HỆ THỐNG</h3>
        </div>

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>
            {combinedData.slice(0, mockdata.length).map((item) => (
              <LinksGroup
                {...item}
                key={item.label}
                active={active}
                onActiveChange={setActive} // truyền hàm để đổi nội dung khi click
              />
            ))}
          </div>

         
        </ScrollArea>
      </nav>

      {/* Phần nội dung hiển thị bên phải */}
      <div
        style={{ 
          flex: 1, 
          padding: 20, 
          overflowY: 'auto', 
          height: '800px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className={classes.hidescrollbar}
      >
        {renderContent()}
      </div>
    </div>
  );
}
