import React, {Fragment} from 'react'
import {Table, Card, Divider, Icon, Button, Form, Modal, message, Input, InputNumber} from 'antd'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import {createOrg, searchOrg} from '../../../services/organization'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 15}
}

const columns = [{
  title: '编号',
  dataIndex: 'org_id',
  key: 'org_id',
}, {
  title: '机构名称',
  dataIndex: 'org_name',
  key: 'org_name',
}, {
  title: '机构面积(m²)',
  dataIndex: 'org_area',
  key: 'org_area',
  width: 150
}, {
  title: '机构面积',
  dataIndex: 'org_address',
  key: 'org_address',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <Button type={'primary'} ghost><Icon type="edit"/>编辑</Button>
      <Divider type="vertical"/>
      <Button type={'primary'} ghost><Icon type="delete"/>删除</Button>
    </span>
  ),
}]
const CreateForm = Form.create()((props) => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props
  const {getFieldDecorator} = form
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建组织机构"
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

@Form.create()
class OrganizationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedRows: [],
      formValues: {},
      tableData: []
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

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = async (fields) => {
    const resp = await createOrg(fields)
    console.log(resp)
    if (!resp) {
      message.error('添加失败')
      return
    }
    message.success('添加成功')
    this.fetchData()
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const {selectedRows, modalVisible, loading, tableData} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    }
    return (
      <PageHeaderLayout title={'组织结构列表'}>
        <Card bordered={false}>
          <div style={{marginBottom: 16}}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </div>
          <Table
            rowKey={record => record.org_id}
            columns={columns}
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
