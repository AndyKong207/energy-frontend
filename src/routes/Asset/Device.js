import React from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, InputNumber, Popconfirm, Select} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createDevice, searchDevice, updateDevice, deleteDevice} from '../../services/device'
import {searchRoom} from '../../services/room'
import {searchDeviceType} from '../../services/deviceType'
import {searchEnergyType} from '../../services/energyType'
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
  dataIndex: 'device_id',
  key: 'device_id',
}, {
  title: '设备号',
  dataIndex: 'device_no',
  key: 'device_no',
}, {
  title: '设备名称',
  dataIndex: 'device_name',
  key: 'device_name',
}, {
  title: '设备类型',
  dataIndex: 'device_type_name',
  key: 'device_type_name',
}, {
  title: '能耗类型',
  dataIndex: 'energy_type_name',
  key: 'energy_type_name',
}, {
  title: '所在房间',
  dataIndex: 'room_no',
  key: 'room_no',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.device_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.device_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]
const fieldNames = ['device_no', 'device_name', 'device_type_id', 'energy_type_id','room_id']
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
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    isEdit,
    editId,
    roomList,
    deviceTypeList,
    energyTypeList
  } = props
  console.log('roomList', roomList)
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
      title={isEdit ? '更新设备': '新建设备'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        {...formItemLayout}
        label={'设备编号'}
      >
        {getFieldDecorator('device_no', {
            rules: [{
              required: true, message: '请输入设备编号',
            }]
          }
        )(
          <Input placehoder={'请输入设备编号'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'设备名称'}
      >
        {getFieldDecorator('device_name', {
            rules: [{
              required: true, message: '请输入设备名称',
            }]
          }
        )(
          <Input placehoder={'请输入设备名称'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'设备类型'}
      >
        {getFieldDecorator('device_type_id', {
            rules: [{
              required: true, message: '请选择设备类型',
            }]
          }
        )(
          <Select style={{width: '100%'}}>
            {Array.isArray(deviceTypeList) && deviceTypeList.map(item => <Option key={item.device_type_id} value={item.device_type_id}>{item.device_type_name}</Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'设备能源类型'}
      >
        {getFieldDecorator('energy_type_id', {
            rules: [{
              required: true, message: '请选择能源类型',
            }]
          }
        )(
          <Select style={{width: '100%'}}>
            {Array.isArray(energyTypeList) && energyTypeList.map(item => <Option key={item.energy_type_id} value={item.energy_type_id}>{item.energy_type_name}</Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'所属房间'}
      >
        {getFieldDecorator('room_id', {
            rules: [{
              required: true, message: '请选择所属房间',
            }]
          }
        )(
          <Select style={{width: '100%'}}>
            {Array.isArray(roomList) && roomList.map(item => <Option key={item.room_id} value={item.room_id}>{item.room_no}</Option>)}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
})

@connect(({ loading }) => ({
  loading: loading.global
}))
@Form.create()
class DeviceList extends React.Component {
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
      roomList: [],
      deviceTypeList: [],
      energyTypeList: []
    }
  }

  componentDidMount() {
    this.fetchData()
    this.fetchOptionData()
  }

  fetchOptionData = async () => {
    const roomList = await searchRoom()
    if (roomList && roomList.length > 0) {
      this.setState({
        roomList
      })
    }

    const deviceTypeList = await searchDeviceType()
    if (deviceTypeList && deviceTypeList.length > 0) {
      this.setState({
        deviceTypeList,
      })
    }
    const energyTypeList = await searchEnergyType()
    if (energyTypeList && energyTypeList.length > 0) {
      this.setState({
        energyTypeList
      })
    }

  }

  fetchData = async () => {
    const resp = await searchDevice()
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
      const resp = await searchDevice({device_id: id})
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
      fields.device_id = editId
    }
    const resp = await (editId? updateDevice : createDevice)(fields)
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

  handleDel = async (device_id) => {
    const resp = await deleteDevice({device_id})
    if (!resp) {
      message.error('删除失败')
    } else {
      message.success('删除成功')
    }
    this.fetchData()
  }

  render() {
    const {loading} = this.props
    const { modalVisible, tableData, isEdit, detail, editId, roomList, deviceTypeList, energyTypeList} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isEdit,
      detail,
      editId,
      roomList,
      deviceTypeList,
      energyTypeList
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

export default DeviceList
