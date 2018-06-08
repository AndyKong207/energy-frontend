import { isUrl } from '../utils/utils';

const menuData = [{
  name: 'dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '能耗监测',
    path: 'monitor',
    children: [{
      name: '区域',
      path: 'region'
    }, {
      name: '系统',
      path: 'system'
    }]
  }, {
    name: '能耗分析',
    path: 'analysis',
    children: [{
      name: '区域',
      path: 'region'
    }, {
      name: '系统',
      path: 'system'
    }]
  }]
}, {
  name: '监测报警',
  icon: 'form',
  path: 'alarm',
  children: [{
    name: '报警记录',
    path: 'list',
  }, {
    name: '添加监测点',
    path: 'form',
  }]
}, {
  name: '资产管理',
  icon: 'hdd',
  path: 'asset',
  children: [{
    name: '机构管理',
    path: 'organization'
  }, {
    name: '区域管理',
    path: 'area',
  }, {
    name: '建筑管理',
    path: 'building',
  }, {
    name: '房间管理',
    path: 'room',
  }, {
    name: '设备管理',
    path: 'device'
  }],
}, {
  name: '系统设置',
  icon: 'setting',
  path: 'setting',
  children: [{
    name: '能耗类型管理',
    path: 'energy/type',
  }, {
    name: '设备类型管理',
    path: 'device/type',
  }],
}, {
  name: '账户',
  icon: 'user',
  path: 'user',
  children: [{
    name: '用户列表',
    path: 'index',
  }],
}];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
