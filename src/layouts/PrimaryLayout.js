/* global window */
/* global document */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import withRouter from 'umi/withRouter'
import { connect } from 'dva'
import { MyLayout } from 'components'
import { BackTop, Layout, Drawer } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { config, pathMatchRegexp, langFromPath } from 'utils'
import Error from '../pages/404'
import styles from './PrimaryLayout.less'
import store from 'store'

const { Content } = Layout
const { Header, Bread, Sider } = MyLayout

@withRouter
@connect(({ app, loading }) => ({ app, loading }))
class PrimaryLayout extends PureComponent {
  state = {
    isMobile: false,
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        })
      }
    })
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
  }

  onCollapseChange = collapsed => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    })
  }

  render() {
    const { app, loading, location, dispatch, children } = this.props
    console.log(app) // 对应app models
    console.log(loading)
    /**
      项目全局数据：
      effects: {app/query: false, dashboard/query: false, dashboard/queryWeather: false, user/query: false}
      global: false
      models: {app: false, dashboard: false, user: false}  
     */
    const { theme, collapsed, notifications } = app
    const user = store.get('user') || {}
    const permissions = store.get('permissions') || {}
    const routeList = store.get('routeList') || []
    const { isMobile } = this.state
    const { onCollapseChange } = this

    // Localized route name.

    const lang = langFromPath(location.pathname)
    const newRouteList =
      lang !== 'en'
        ? routeList.map(item => {
            const { name, ...other } = item
            return {
              ...other,
              name: (item[lang] || {}).name || name,
            }
          })
        : routeList

    // Find a route that matches the pathname.
    const currentRoute = newRouteList.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )

    // Query whether you have permission to enter this page
    const hasPermission = currentRoute
      ? permissions.visit.includes(currentRoute.id)
      : false

    // MenuParentId is equal to -1 is not a available menu.
    const menus = newRouteList.filter(_ => _.menuParentId !== '-1')

    const headerProps = {
      menus,
      collapsed,
      notifications,
      onCollapseChange,
      avatar: user.avatar,
      username: user.username,
      fixed: config.fixedHeader,
      onAllNotificationsRead() {
        dispatch({ type: 'app/allNotificationsRead' })
      },
      onSignOut() {
        dispatch({ type: 'app/signOut' })
      },
    }

    const siderProps = {
      theme,
      menus,
      isMobile,
      collapsed,
      onCollapseChange,
      onThemeChange(theme) {
        dispatch({
          type: 'app/handleThemeChange',
          payload: theme,
        })
      },
    }

    return (
      <Fragment>
        <Layout>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              onClose={onCollapseChange.bind(this, !collapsed)}
              visible={!collapsed}
              placement="left"
              width={200}
              style={{
                padding: 0,
                height: '100vh',
              }}
            >
              <Sider {...siderProps} collapsed={false} />
            </Drawer>
          ) : (
            <Sider {...siderProps} />
          )}
          <div
            className={styles.container}
            style={{ paddingTop: config.fixedHeader ? 72 : 0 }}
            id="primaryLayout"
          >
            <Header {...headerProps} />
            <Content className={styles.content}>
              <Bread routeList={newRouteList} />
              {hasPermission ? children : <Error />}
            </Content>
            <BackTop
              className={styles.backTop}
              target={() => document.querySelector('#primaryLayout')}
            />
            <GlobalFooter
              className={styles.footer}
              copyright={config.copyright}
            />
          </div>
        </Layout>
      </Fragment>
    )
  }
}

PrimaryLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default PrimaryLayout

/**
项目布局，入口文件：
1.PropTypes，应用于PrimaryLayout，进行类型限制；
  地址：https://github.com/facebook/prop-types
  PrimaryLayout.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
  }
  理解：对传入组件的相关属性，值或者类型，做相应的验证和限制;


2.import withRouter from 'umi/withRouter'
  理解：为react-router功能的重新封装；
  @withRouter

3.import { connect } from 'dva'
  @connect(({ app, loading }) => ({ app, loading })) 
  models中定义的state,可以直接在ui组件中使用？



4.import { BackTop, Layout, Drawer } from 'antd'
  BackTop：返回页面顶部的操作按钮。
  Layout：协助进行页面级整体布局。
  Drawer：屏幕边缘滑出的浮层面板。针对手机端布局；

5.import { GlobalFooter } from 'ant-design-pro'
  分析：ant-design-pro里面封装了哪些可用的组件？


6.import { enquireScreen, unenquireScreen } from 'enquire-js'
  地址：https://github.com/WickyNilliams/enquire.js
  介绍：用于以编程方式响应媒体查询。


7.import { config, pathMatchRegexp, langFromPath } from 'utils'
  介绍：utils中封装的方法；
  config：
  pathMatchRegexp：
  langFromPath：

8.dva
  详细文档：https://dvajs.com/
 




 */
