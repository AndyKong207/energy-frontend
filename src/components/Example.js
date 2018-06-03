import React from 'react';

const Example = () => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={this.state.collapsed}
      style={{ overflow: 'auto', height: '100vh' }}
    >
      <div className={Styles['logo']} />
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
      >
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <span>能耗地图</span>
        </Menu.Item>
        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>能耗监测</span></span>}>
          <Menu.Item key="5">区域</Menu.Item>
          <Menu.Item key="6">系统</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>能耗分析</span></span>}>
          <Menu.Item key="9">区域</Menu.Item>
          <Menu.Item key="10">系统</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="appstore" /><span>监测报警</span></span>}>
          <Menu.Item key="11">报警记录</Menu.Item>
          <Menu.Item key="12">添加监测点</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="appstore" /><span>资产管理</span></span>}>
          <Menu.Item key="11">区域管理</Menu.Item>
          <Menu.Item key="12">建筑管理</Menu.Item>
          <Menu.Item key="12">房间管理</Menu.Item>
          <Menu.Item key="12">设备管理</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="appstore" /><span>系统设置</span></span>}>
          <Menu.Item key="11">资源类型管理</Menu.Item>
          <Menu.Item key="12">能耗系统类型管理</Menu.Item>
        </SubMenu>
        <Menu.Item key="3">
          <Icon type="inbox" />
          <span>报表</span>
        </Menu.Item>
        <SubMenu key="sub3" title={<span><Icon type="appstore" /><span>用户管理</span></span>}>
          <Menu.Item key="11">用户列表</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

Example.propTypes = {
};

export default Example;
