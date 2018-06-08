import React from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, Popconfirm} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createEnergyType, searchEnergyType, updateEnergyType, deleteEnergyType} from '../../services/energyType'
import pick from 'lodash/pick'
import {connect} from 'dva'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 15}
}

const columns = (ctx) => [{
  title: '编号',
  dataIndex: 'energy_type_id',
  key: 'energy_type_id',
}, {
  title: '设备类型名称',
  dataIndex: 'energy_type_name',
  key: 'energy_type_name',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost onClick={() => ctx.handleModalVisible(true, record.energy_type_id)}><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Popconfirm placement="topRight" title={'确定删除吗？'} onConfirm={() => ctx.handleDel(record.energy_type_id)} okText="确定" cancelText="取消">
        <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
      </Popconfirm>
    </span>
  ),
}]
const fieldNames = ['energy_type_name']
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
      title={isEdit ? '更新能耗类型': '新建能耗类型'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        {...formItemLayout}
        label={'能耗类型名称'}
      >
        {getFieldDecorator('energy_type_name', {
            rules: [{
              required: true, message: '请输入能耗类型名称',
            }]
          }
        )(
          <Input placeholder={'请输入能耗类型名称'}/>
        )}
      </FormItem>

    </Modal>
  );
})

@connect(({ loading }) => ({
  loading: loading.global
}))
@Form.create()
class EnergyTypeList extends React.Component {
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
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const resp = await searchEnergyType()
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
      const resp = await searchEnergyType({energy_type_id: id})
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
      fields.energy_type_id = editId
    }
    const resp = await (editId? updateEnergyType : createEnergyType)(fields)
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

  handleDel = async (energy_type_id) => {
    const resp = await deleteEnergyType({energy_type_id})
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
      <PageHeaderLayout title={'能耗类型列表'}>
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

export default EnergyTypeList
