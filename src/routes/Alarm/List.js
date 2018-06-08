import React from 'react'
import {Table, Card, Divider, Icon, Button, Popconfirm, message} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createMonitor, searchMonitor, updateMonitor, deleteMonitor} from '../../services/monitor'
import {connect} from 'dva'
import {withRouter} from 'dva/router'

const columns = (ctx) => [{
  title: '编号',
  dataIndex: 'monitor_id',
  key: 'monitor_id',
}, {
  title: '报警监测点名称',
  dataIndex: 'monitor_name',
  key: 'monitor_name',
}, {
  title: '报警事件名称',
  dataIndex: 'monitor_size',
  key: 'monitor_size',
}, {
  title: '报警事件描述',
  dataIndex: 'monitor_description',
  key: 'monitor_description',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.monitor_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.monitor_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]

@connect(({ loading }) => ({
  loading: loading.global
}))
class MonitorList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const resp = await searchMonitor()
    if (resp && resp.length > 0) {
      this.setState({
        tableData: resp
      })
    }
  }


  handleDel = async (monitor_id) => {
    const resp = await deleteMonitor({monitor_id})
    if (!resp) {
      message.error('删除失败')
    } else {
      message.success('删除成功')
    }
    this.fetchData()
  }

  render() {
    const {loading, history} = this.props
    const {tableData} = this.state;

    return (
      <PageHeaderLayout title={'区域列表'}>
        <Card bordered={false}>
          <div style={{marginBottom: 16}}>
            <Button icon="plus" type="primary" onClick={() => history.push('/alarm/form')}>
              添加监测点
            </Button>
          </div>
          <Table
            loading={loading}
            rowKey={record => record.monitor_id}
            columns={columns(this)}
            dataSource={tableData}
          />
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default withRouter(MonitorList)
