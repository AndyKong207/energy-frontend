import React from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, InputNumber, Popconfirm, Select} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createRoom, searchRoom, updateRoom, deleteRoom} from '../../services/room'
import {searchBuilding} from '../../services/building'
import pick from 'lodash/pick'
import {connect} from 'dva'

const FormItem = Form.Item
const {Option} = Select

const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 15}
}

const columns = (ctx) => [{
  title: '编号',
  dataIndex: 'room_id',
  key: 'room_id',
}, {
  title: '房间号',
  dataIndex: 'room_no',
  key: 'room_no',
}, {
  title: '房间面积',
  dataIndex: 'room_size',
  key: 'room_size',
}, {
  title: '所在建筑',
  dataIndex: 'building_name',
  key: 'building_name',
}, {
  title: '所在楼层',
  dataIndex: 'room_floor',
  key: 'room_floor',
}, {
  title: '环境监测设备',
  dataIndex: 'env_device_id',
  key: 'env_device_id',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.room_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.room_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]
const fieldNames = ['room_no', 'room_size', 'building_id', 'room_floor','env_device_id']
const CreateForm = Form.create({
  mapPropsToFields(props) {
    const {detail} = props
    let fields = {}
    if (detail) {
      fieldNames.forEach(key => fields[key] = Form.createFormField({ value: detail[key] }))
    } else {
      fieldNames.forEach(key => fields[key] = Form.createFormField({ value: '' }))
    }
    return fields
  }
})((props) => {
  const {modalVisible, form, handleAdd, handleModalVisible, isEdit, editId, buildingList} = props
  const {getFieldDecorator} = form

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleAdd(fieldsValue, editId)
    })
  }
  return (
    <Modal
      title={isEdit ? '更新房间': '新建房间'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        {...formItemLayout}
        label={'房间编号'}
      >
        {getFieldDecorator('room_no', {
            rules: [{
              required: true, message: '请输入房间编号',
            }]
          }
        )(
          <Input placehoder={'请输入房间编号'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'房间面积'}
      >
        {getFieldDecorator('room_size', {
            rules: [{
              required: true, message: '请输入房间面积',
            }]
          }
        )(
          <InputNumber min={1}/>
        )}
        <span style={{marginLeft: 8}}>㎡</span>
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'所属建筑'}
      >
        {getFieldDecorator('building_id', {
            rules: [{
              required: true, message: '请输入所属建筑',
            }]
          }
        )(
          <Select style={{width: '100%'}}>
            {buildingList && buildingList.map(item => <Option key={item.building_id} value={item.building_id}>{item.building_name}</Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'所在楼层'}
      >
        {getFieldDecorator('room_floor', {
            rules: [{
              required: true, message: '请输入所在楼层',
            }]
          }
        )(
          <InputNumber min={1}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'环境监测设备编号'}
      >
        {getFieldDecorator('env_device_id', {}
        )(
          <Input placehoder={'环境设备编号'}/>
        )}
      </FormItem>

    </Modal>
  );
})

@connect(({ loading }) => ({
  loading: loading.global
}))
@Form.create()
class RoomList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedRows: [],
      formValues: {},
      tableData: [],
      isEdit: false,
      detail: null,
      editId: null,
      buildingList: []
    }
  }

  componentDidMount() {
    this.fetchData()
    this.fetchBuildingData()
  }

  fetchBuildingData = async () => {
    const buildingList = await searchBuilding()
    if (buildingList && buildingList.length > 0) {
      this.setState({
        buildingList: buildingList
      })
    }
  }

  fetchData = async () => {
    const resp = await searchRoom()
    if (resp && resp.length > 0) {
      this.setState({
        tableData: resp
      })
    }
  }

  handleModalVisible = async (flag, id) => {
    this.setState({
      modalVisible: !!flag,
    })
    if (id) {
      const resp = await searchRoom({room_id: id})
      if (resp.length > 0) {
        const values = pick(resp[0], fieldNames)
        this.setState({
          isEdit: true,
          detail: values,
          editId: id
        })
      }
    } else {
      this.setState({
        isEdit: false,
        detail: null,
        editId: null
      })
    }
  }

  handleAdd = async (fields, editId) => {
    if (editId) {
      fields.room_id = editId
    }
    const resp = await (editId? updateRoom : createRoom)(fields)
    if (!resp) {
      message.error(editId ? '修改失败': '添加失败')
      return
    }
    message.success(editId ? '修改成功': '添加成功')
    this.fetchData()
    this.setState({
      modalVisible: false,
    });
  }

  handleDel = async (room_id) => {
    const resp = await deleteRoom({room_id})
    if (!resp) {
      message.error('删除失败')
    } else {
      message.success('删除成功')
    }
    this.fetchData()
  }

  render() {
    const {loading} = this.props
    const { modalVisible, tableData, isEdit, detail, editId, buildingList} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isEdit,
      detail,
      editId,
      buildingList
    }
    return (
      <PageHeaderLayout title={'建筑列表'}>
        <Card bordered={false}>
          <div style={{marginBottom: 16}}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, null)}>
              新建
            </Button>
          </div>
          <Table
            loading={loading}
            rowKey={record => record.org_id}
            columns={columns(this)}
            dataSource={tableData}
          />
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    )
  }
}

export default RoomList
