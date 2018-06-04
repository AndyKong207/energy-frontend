import React from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, InputNumber, Popconfirm} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createOrg, searchOrg, updateOrg, deleteOrg} from '../../services/organization'
import pick from 'lodash/pick'
import {connect} from 'dva'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 15}
}

const columns = (ctx) => [{
  title: '编号',
  dataIndex: 'org_id',
  key: 'org_id',
}, {
  title: '区域名称',
  dataIndex: 'org_name',
  key: 'org_name',
}, {
  title: '区域描述',
  dataIndex: 'org_area',
  key: 'org_area',
  width: 150
}, {
  title: '所属机构',
  dataIndex: 'org_address',
  key: 'org_address',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.org_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.org_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]
const fieldNames = ['org_name', 'org_area', 'org_address']
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
  const {modalVisible, form, handleAdd, handleModalVisible, isEdit, editId} = props
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
      title={isEdit ? '更新组织机构': '新建组织机构'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        {...formItemLayout}
        label={'机构名称'}
      >
        {getFieldDecorator('org_name', {
            rules: [{
              required: true, message: '请输入机构名称',
            }]
          }
        )(
          <Input placehoder={'请输入机构名称'}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'机构面积'}
      >
        {getFieldDecorator('org_area', {
            rules: [{
              required: true, message: '请输入机构面积',
            }]
          }
        )(
          <InputNumber min={1}/>
        )}
        <span style={{marginLeft: 8}}>㎡</span>
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={'详细地址'}
      >
        {getFieldDecorator('org_address', {
            rules: [{
              required: true, message: '请输入机构地址',
            }]
          }
        )(
          <Input placehoder={'请输入机构地址'}/>
        )}
      </FormItem>
    </Modal>
  );
})

@connect(({ loading }) => ({
  loading: loading.global
}))
@Form.create()
class OrganizationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedRows: [],
      formValues: {},
      tableData: [],
      isEdit: false,
      detail: null,
      editId: null
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const resp = await searchOrg()
    this.setState({
      tableData: resp
    })
  }

  handleModalVisible = async (flag, id) => {
    this.setState({
      modalVisible: !!flag,
    })
    if (id) {
      const resp = await searchOrg({org_id: id})
      if (resp.length > 0) {
        const values = pick(resp[0], ['org_name', 'org_area', 'org_address'])
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
      fields.org_id = editId
    }
    const resp = await (editId? updateOrg : createOrg)(fields)
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

  handleDel = async (org_id) => {
    const resp = await deleteOrg({org_id})
    if (!resp) {
      message.error('删除失败')
    } else {
      message.success('删除成功')
    }
    this.fetchData()
  }

  render() {
    const {loading} = this.props
    const { modalVisible, tableData, isEdit, detail, editId} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isEdit,
      detail,
      editId
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

export default OrganizationList
