import React from 'react'
import {Table, Form, Input, Card, InputNumber, Button, message} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import {createOrg} from '../../services/organization'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 10},
  },
}
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@Form.create()
export default class Organization extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll({force: true}, async (err, values) => {
      if (err) return
      console.log(values)
      const resp = await createOrg(values)
      console.log(resp)
      if (!resp) {
        message.error('添加失败')
        return
      }
      message.info('添加成功')
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <PageHeaderLayout
        title={'机构管理'}
      >
        <Card border={false}>
          <Form onSubmit={this.onSubmit}>
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
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
