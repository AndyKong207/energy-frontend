import React from 'react'
import { Router, Route, Switch, routerRedux } from 'dva/router'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import IndexPage from './routes/IndexPage';
import { getRouterData } from './common/router';

const { ConnectedRouter } = routerRedux

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app)
  const BasicLayout = routerData['/'].component
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Route render={props => <BasicLayout {...props}/>}/>
      </ConnectedRouter>
    </LocaleProvider>
  )
}

export default RouterConfig;
