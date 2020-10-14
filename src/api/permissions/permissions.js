import { post,get,delet,put } from '@/utils/http'
import { data } from 'autoprefixer'

//获取全部人员列表接口
/**
 *
 * @param {*} data
 * data:{
 * page:1 当前第几页，默认 1
 * pageSize:20 每页条数，默认 10
 * }
 **/
export const getUserList = data => get('user/list',data)

// 获取全部角色列表
/**
 *
 * @param {*} data
 * data:{
 * page:1 当前第几页，默认 1
 * pageSize:20 每页条数，默认 10
 * }
 **/

export const getRolesList = data => get('role/noPage',data) // 获取角色列表不分页
export const getRolesListPage = data => get('role/list',data) // 获取角色列表分页

// 请求组织机构(部门)
export const getOrganization = data => get('organization/tree',data)

// 修改账号
export const changeAccount = data => put('user',data)

//添加账号
export const addAccount = data => post('user',data)

// 删除/注销账号
export const deleteAccount = data => delet('user',data)


/**角色相关 */
// 获取菜单树
export const getAllMenu = data => get('menu/tree',data)
//获取角色拥有的菜单
export const getRoleMenu = data => get('roleMenu/list',data)
// 修改角色菜单
export const changeRoleMenu = data => put('roleMenu',data,'no')
// 修改角色信息
export const changeRole = data => put('role',data)
// 新建角色
export const addRole = data => post('role',data)
// 注销/删除角色
export const deleteRole = data => delet('role',data)


// 部门管理
// 修改组织机构信息
export const changeOrganization = data => put('organization',data)
// 删除组织机构信息
export const deleteOrganization = data => delet('organization',data)
// 新增组织机构信息
export const addOrganization = data => post('organization',data)