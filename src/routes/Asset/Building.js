import React from 'react'
import {Table, Form, Input} from 'antd'
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
export default class Building extends React.Component {
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <PageHeaderLayout
        title={'区域管理'}
      >
        <Form>
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
      </PageHeaderLayout>
    )
  }
}
