

export const API_ROUTE = {
  LOGIN: "/api/v1/login/access-token",
  REGISTER:"/api/v1/users/signup",
    SENDEMAIL: "/api/v1/password-recovery/{email}",
    LOGIN_USERNAME:"/api/v1/users/me",
    UPDATE_ME:"/api/v1/users/me",
    GET_LIST_USER:"/api/v1/users/", 
    CREATE_USERNAME:"/api/v1/users",
    UPDATE_USERNAME:"/api/v1/users/{user_id}",
    DELETE_USERNAME:"/api/v1/users/{user_id}",

  
    //Roles
    GET_LIST_ROLES:"/api/v1/roles/",
    CREATE_ROLES:"/api/v1/roles",
    UPDATE_ROLES:"/api/v1/roles/{role_id}",
    DELETE_ROLES:"/api/v1/roles/{role_id}",
    

  //System
  GET_LIST_SYSTEM:"/api/v1/system/",
  CREATE_SYSTEM:"/api/v1/system",
  UPDATE_SYSTEM:"/api/v1/system/{system_id}",
  DELETE_SYSTEM:"/api/v1/system/{system_id}",

  //Permission
  GET_LIST_PERMISSION:"/api/v1/permission/",
  CREATE_PERMISSION:"/api/v1/permission",
  UPDATE_PERMISSION:"/api/v1/permission/{Permission_id}",
  DELETE_PERMISSION:"/api/v1/permission/{Permission_id}",

    //Projects
    GET_LIST_PROJECTS:"/api/v1/projects/",
    CREATE_PROJECTS:"/api/v1/projects/",
    UPDATE_PROJECTS:"/api/v1/projects/{project_id}",
    DELETE_PROJECTS:"/api/v1/projects/{project_id}",

//RolePermission
    GET_LIST_ROLEPERMISSION:"/api/v1/RolePermission/permission",
    CREATE_ROLEPERMISSION:"/api/v1/RolePermission/permission",
    UPDATE_ROLEPERMISSION:"/api/v1/RolePermission/permission/{role_permission_id}",
    DELETE_ROLEPERMISSION:"/api/v1/RolePermission/permission/{role_permission_id}",

    //SystemPermission

    GET_LIST_SYSTEMPERMISSION:"/api/v1/SystemPermission/permission",
    CREATE_SYSTEMPERMISSION:"/api/v1/SystemPermission/permission",
    UPDATE_SYSTEMPERMISSION:"/api/v1/SystemPermission/permission/{system_permission_id}",
    DELETE_SYSTEMPERMISSION:"/api/v1/SystemPermission/permission/{system_permission_id}",
  
  
    //UserProjectRole
    GET_LIST_USERPROJECTROLE:"/api/v1/UserProjectRole/assignments",
    CREATE_USERPROJECTROLE:"/api/v1/UserProjectRole/{project_id}",
   DELETE_USERPROJECTROLE:"/api/v1/UserProjectRole/{user_project_role_id}",
    UPDATE_USERPROJECTROLE:"/api/v1/UserProjectRole/{user_id}/{project_id}/{old_role_id}",

///Attributes
    GET_LIST_ATTRIBUTES:"/api/v1/attributes/",
    CREATE_ATTRIBUTES:"/api/v1/attributes/",
    UPDATE_ATTRIBUTES:"/api/v1/attributes/{attribute_id}",
    DELETE_ATTRIBUTES:"/api/v1/attributes/{attribute_id}",

///ProjectTemplates
GET_LIST_PROJECTTEMPLATES:"/api/v1/project_templates/",
CREATE_PROJECTTEMPLATES:"/api/v1/project_templates/",
UPDATE_PROJECTTEMPLATES:"/api/v1/project_templates/{template_id}",
DELETE_PROJECTTEMPLATES:"/api/v1/project_templates/{template_id}",

///ProjectType
GET_LIST_PROJECTTYPE:"/api/v1/project_type/",
CREATE_PROJECTTYPE:"/api/v1/project_type/",
UPDATE_PROJECTTYPE:"/api/v1/project_type/{type_id}",
DELETE_PROJECTTYPE:"/api/v1/project_type/{type_id}",


///TemplateAttributesLink

GET_LIST_TEMPLATEATTRIBUTESLINK:"/api/v1/template_attributes/by-template/{template_id}",
GET_TEMPLATEATTRIBUTESLINK:"/api/v1/template_attributes/{link_id}",
CREATE_TEMPLATEATTRIBUTESLINK:"/api/v1/template_attributes/",
UPDATE_TEMPLATEATTRIBUTESLINK:"/api/v1/template_attributes/{link_id}",
DELETE_TEMPLATEATTRIBUTESLINK:"/api/v1/template_attributes/{link_id}",

///NodeAttribute
CREATE_NODEATTRIBUTE:"/api/v1/node_attribute/filter",

//filterwarehouse
CREATE_SALEINFORMATION:"/api/v1/product_information/basic_information",

CREATE_SALE_INFORMATION:"/api/v1/product_information/sale_information/{project_id}",


//Address
GET_LIST_ADDRESS:"/api/v1/address/provinces",
GET_LIST_ADDRESS_DEATIL:"/api/v1/address/provinces",


/// delete
DELETE_PROJECT:"/api/v1/control/release_controll/{project_id}",


////JoinProject

GET_LIST_JOINPROJECT:"/api/v1/JoinProject/me",
GET_REQUEST:"/api/v1/JoinProject/{request_id}",
GET_LIST_REQUESTS:"/api/v1/JoinProject/",
CREATE_REQUEST:"/api/v1/JoinProject/{project_id}",
  UPDATE_REQUEST:"/api/v1/JoinProject/{project_id}/{request_id}",
DELETE_REQUEST:"/api/v1/JoinProject/{project_id}/{request_id}",


/////deltai home
GET_LIST_DETAIL_HOME:"/api/v1/detal_unit/get_detal_units/{project_id}/{unit_code}",


////Project basic
GET_LIST_PROJECT_BASIC:"/api/v1/projects/basic",

///Control
    GET_LIST_CONTROL:"/api/v1/projects/control/",


}
