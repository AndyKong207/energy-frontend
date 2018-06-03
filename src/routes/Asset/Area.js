import React from 'react'
import {Table, Form, Input, Card, InputNumber, Button} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'

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
export default class Area extends React.Component {
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <PageHeaderLayout
        title={'区域管理'}
      >
        <Card border={false}>
          <Form>
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
                <Input placehoder={'请输入区域名称'}/>
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
