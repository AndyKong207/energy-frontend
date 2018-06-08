import React from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, InputNumber, Popconfirm, Select} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createBuilding, searchBuilding, updateBuilding, deleteBuilding} from '../../services/building'
import {searchArea} from '../../services/area'
import pick from 'lodash/pick'
import {connect} from 'dva'

const FormItem = Form.Item
const {Option} = Select

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 15}
}

const columns = (ctx) => [{
  title: '编号',
  dataIndex: 'building_id',
  key: 'building_id',
}, {
  title: '建筑名称',
  dataIndex: 'building_name',
  key: 'building_name',
}, {
  title: '建筑面积',
  dataIndex: 'building_area',
  key: 'building_area',
}, {
  title: '建筑地址',
  dataIndex: 'building_address',
  key: 'building_address',
}, {
  title: '建筑楼层',
  dataIndex: 'building_floor',
  key: 'building_floor',
}, {
  title: '所属建筑',
  dataIndex: 'area_name',
  key: 'area_name',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.building_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.building_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]
const fieldNames = ['building_name', 'building_area', 'building_intro', 'building_floor', 'building_address','area_id']
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
  const {modalVisible, form, handleAdd, handleModalVisible, isEdit, editId, areaList} = props
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
      title={isEdit ? '更新建筑': '新建建筑'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        {...formItemLayout}
        label={'建筑名称'}
      >
        {getFieldDecorator('building_name', {
            rules: [{
              required: true, message: '请输入建筑名称',
            }]
          }
        )(
          <Input placeholder={'请输入建筑名称'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'建筑面积'}
      >
        {getFieldDecorator('building_area', {
            rules: [{
              required: true, message: '请输入建筑面积',
            }]
          }
        )(
          <InputNumber min={1}/>
        )}
        <span style={{marginLeft: 8}}>㎡</span>
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'建筑楼层'}
      >
        {getFieldDecorator('building_floor', {
            rules: [{
              required: true, message: '请输入建筑楼层',
            }]
          }
        )(
          <InputNumber min={1}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'建筑地址'}
      >
        {getFieldDecorator('building_address', {
            rules: [{
              required: true, message: '请输入建筑地址',
            }]
          }
        )(
          <Input placeholder={'请输入建筑地址'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'建筑描述'}
      >
        {getFieldDecorator('building_intro', {
            rules: [{
              required: true, message: '请输入建筑描述',
            }]
          }
        )(
          <Input placeholder={'请输入建筑描述'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'所属区域'}
      >
        {getFieldDecorator('area_id', {
            rules: [{
              required: true, message: '请输入所属区域',
            }]
          }
        )(
          <Select style={{width: '100%'}}>
            {areaList && areaList.map(item => <Option key={item.area_id} value={item.area_id}>{item.area_name}</Option>)}
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
class BuildingList extends React.Component {
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
      areaList: []
    }
  }

  componentDidMount() {
    this.fetchData()
    this.fetchAreaData()
  }

  fetchAreaData = async () => {
    const areaList = await searchArea()
    if (areaList && areaList.length > 0) {
      this.setState({
        areaList: areaList
      })
    }
  }

  fetchData = async () => {
    const resp = await searchBuilding()
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
      const resp = await searchBuilding({building_id: id})
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
      fields.building_id = editId
    }
    const resp = await (editId? updateBuilding : createBuilding)(fields)
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

  handleDel = async (building_id) => {
    const resp = await deleteBuilding({building_id})
    if (!resp) {
      message.error('删除失败')
    } else {
      message.success('删除成功')
    }
    this.fetchData()
  }

  render() {
    const {loading} = this.props
    const { modalVisible, tableData, isEdit, detail, editId, areaList} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isEdit,
      detail,
      editId,
      areaList
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

export default BuildingList
