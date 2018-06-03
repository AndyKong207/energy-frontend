import React from 'react'
import {Table, Form, Input, Card} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
}

@Form.create()
export default class Device extends React.Component {
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <PageHeaderLayout
        title={'区域管理'}
      >
        <Card bordered={false}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '请输入标题',
                }],
              })(
                <Input placeholder="给目标起个名字" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'区域名称'}
            >
              {getFieldDecorator('area_name', [
                  {required: true}
                ]
              )(
                <Input placehoder={'请输入区域名称'}/>
              )}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
