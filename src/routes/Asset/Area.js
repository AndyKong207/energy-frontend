import React from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, InputNumber, Popconfirm, Select} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createArea, searchArea, updateArea, deleteArea} from '../../services/area'
import {searchOrg} from '../../services/organization'
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
  dataIndex: 'area_id',
  key: 'area_id',
}, {
  title: '区域名称',
  dataIndex: 'area_name',
  key: 'area_name',
}, {
  title: '区域面积',
  dataIndex: 'area_size',
  key: 'area_size',
}, {
  title: '区域描述',
  dataIndex: 'area_description',
  key: 'area_description',
}, {
  title: '所属机构',
  dataIndex: 'org_name',
  key: 'org_name',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.area_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.area_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]
const fieldNames = ['area_name', 'area_size', 'area_description', 'org_id']
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
  const {modalVisible, form, handleAdd, handleModalVisible, isEdit, editId, orgList} = props
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
      title={isEdit ? '更新区域': '新建区域'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        {...formItemLayout}
        label={'区域名称'}
      >
        {getFieldDecorator('area_name', {
            rules: [{
              required: true, message: '请输入区域名称',
            }]
          }
        )(
          <Input placeholder={'请输入区域名称'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'区域面积'}
      >
        {getFieldDecorator('area_size', {
            rules: [{
              required: true, message: '请输入区域面积',
            }]
          }
        )(
          <InputNumber min={1}/>
        )}
        <span style={{marginLeft: 8}}>㎡</span>
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'区域描述'}
      >
        {getFieldDecorator('area_description', {
            rules: [{
              required: true, message: '请输入区域描述',
            }]
          }
        )(
          <Input placeholder={'请输入区域描述'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'所属机构'}
      >
        {getFieldDecorator('org_id', {
            rules: [{
              required: true, message: '请输入机构地址',
            }]
          }
        )(
          <Select style={{width: '100%'}}>
            {orgList && orgList.map(item => <Option key={item.org_id} value={item.org_id}>{item.org_name}</Option>)}
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
class AreaList extends React.Component {
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
      orgList: []
    }
  }

  componentDidMount() {
    this.fetchData()
    this.fetchOrgData()
  }

  fetchOrgData = async () => {
    const orgList = await searchOrg()
    if (orgList && orgList.length > 0) {
      this.setState({
        orgList: orgList
      })
    }
  }

  fetchData = async () => {
    const resp = await searchArea()
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
      const resp = await searchArea({area_id: id})
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
      fields.area_id = editId
    }
    const resp = await (editId? updateArea : createArea)(fields)
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

  handleDel = async (area_id) => {
    const resp = await deleteArea({area_id})
    if (!resp) {
      message.error('删除失败')
    } else {
      message.success('删除成功')
    }
    this.fetchData()
  }

  render() {
    const {loading} = this.props
    const { modalVisible, tableData, isEdit, detail, editId, orgList} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isEdit,
      detail,
      editId,
      orgList
    }
    return (
      <PageHeaderLayout title={'区域列表'}>
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

export default AreaList
