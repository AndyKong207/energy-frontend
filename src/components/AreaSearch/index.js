import React, {Fragment} from 'react'
import {Select, Form, Button, Row, Col, DatePicker} from 'antd'

const {RangePicker} = DatePicker
const {Option} = Select
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
class AreaSearch extends React.Component {
  render() {
    const {isShowDatePicker} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Fragment>
        <Form layout={'inline'}>
          <FormItem
            {...formItemLayout}
            label="区域"
          >
            {
              getFieldDecorator('a')(
                <Select style={{width: 120}}>
                  <Option value="a">Jack</Option>
                  <Option value="b">Lucy</Option>
                  <Option value="c" disabled>Disabled</Option>
                  <Option value="d">yiminghe</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="建筑"
          >
            {
              getFieldDecorator('b')(
                <Select style={{width: 120}}>
                  <Option value="a">Jack</Option>
                  <Option value="b">Lucy</Option>
                  <Option value="c" disabled>Disabled</Option>
                  <Option value="d">yiminghe</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="楼层"
          >
            {
              getFieldDecorator('a')(
                <Select style={{width: 120}}>
                  <Option value="a">Jack</Option>
                  <Option value="b">Lucy</Option>
                  <Option value="c" disabled>Disabled</Option>
                  <Option value="d">yiminghe</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="房间"
          >
            {
              getFieldDecorator('a')(
                <Select style={{width: 120}}>
                  <Option value="a">Jack</Option>
                  <Option value="b">Lucy</Option>
                  <Option value="c" disabled>Disabled</Option>
                  <Option value="d">yiminghe</Option>
                </Select>
              )
            }
          </FormItem>
          {
            isShowDatePicker && <FormItem
              {...formItemLayout}
              label="选择日期"
            >
              {
                getFieldDecorator('a')(
                  <RangePicker/>
                )
              }
            </FormItem>
          }
          <FormItem>
            <Button type={'primary'} icon={'search'}>搜索</Button>
          </FormItem>
        </Form>
      </Fragment>
    )
  }
}

export default AreaSearch
