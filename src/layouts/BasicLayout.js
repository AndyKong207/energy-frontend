import React from 'react'
import PropTypes from 'prop-types'
import {Layout, Menu, Icon, message} from 'antd'
import Styles from './BasicLayout.less'
import SiderMenu from '../components/SiderMenu'
import {Route, Switch, routerRedux, Link, Redirect} from 'dva/router'
import {getRoutes} from '../utils/utils'
import {getMenuData} from '../common/menu'
import {connect} from 'dva'

const {Sider, Header, Content} = Layout
const {SubMenu} = Menu
const {ConnectedRouter} = routerRedux

class BasicLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {collapsed: false}
  }
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  render() {
    const {
      match, location, routerData, info
    } = this.props

    const {manager_nick_name} = info || {}

    return (
      <div className={Styles['basic-layout']}>
        <Layout style={{minHeight: '100vh'}}>
          <SiderMenu
            // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
            // If you do not have the Authorized parameter
            // you will be forced to jump to the 403 interface without permission
            // Authorized={Authorized}
            menuData={getMenuData()}
            collapsed={this.state.collapsed}
            location={location}
            isMobile={false}
          />

          <Layout>
            <Header style={{background: '#fff', padding: 0}}>
              <Icon
                className={Styles['trigger']}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <div style={{float: 'right', height: 64, lineHeight: '64px', marginRight: 20}}>
                {manager_nick_name && <div>
                  欢迎 {manager_nick_name}
                  <a style={{display: 'inline-block', marginLeft: 10}}
                     onClick={this.logout}>登出</a>
                </div>}
              </div>
            </Header>
            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact
                    />
                  ))
                }
                <Redirect exact from="/" to={'/dashboard/monitor/region'} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default BasicLayout
