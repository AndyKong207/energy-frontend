import React from 'react'
import {Form, Card, Input, Select, Button, message} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import pick from 'lodash/pick'
import {connect} from 'dva'
import {searchOrg} from '../../services/organization'
import {searchArea} from '../../services/area'
import {searchBuilding} from '../../services/building'
import {searchRoom} from '../../services/room'
import {searchDevice} from '../../services/device'
import {searchUser} from '../../services/user'
import {createMonitor, updateMonitor} from '../../services/monitor'

const FormItem = Form.Item
const {Option} = Select
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
}
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
}
@connect(({ loading }) => ({
  loading: loading.global
}))
@Form.create()
class AlarmForm extends React.Component {
  state = {
    orgList: [],
    areaList: [],
    buildingList: [],
    roomList: [],
    deviceList: [],
    userList: [],
    floorList: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }

  async componentDidMount() {
    const orgList = await searchOrg()
    const areaList = await searchArea()
    const buildingList = await searchBuilding()
    const roomList = await searchRoom()
    const deviceList = await searchDevice()
    const userList = await searchUser()
    this.setState({
      orgList,
      areaList,
      buildingList,
      roomList,
      deviceList,
      userList
    })
  }

  handleAdd = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, fieldsValue) => {
      if (err) return
      this.props.form.resetFields()
      const resp = await createMonitor(fieldsValue)
      if (!resp) {
        message.error('添加失败')
        return
      }
      message.success('添加成功')
    })

  }

  render() {
    const {form} = this.props
    const {getFieldDecorator} = form
    const {
      orgList,
      areaList,
      buildingList,
      roomList,
      deviceList,
      floorList,
      userList
    } = this.state
    return (
      <PageHeaderLayout title={'添加监测点'}>
        <Card bordered={false}>
          <Form onSubmit={this.handleAdd}>
            <FormItem
              {...formItemLayout}
              label={'监测点名称'}
            >
              {getFieldDecorator('area_name', {
                  rules: [{
                    required: true, message: '请输入监测点名称',
                  }]
                }
              )(
                <Input placeholder={'请输入监测点名称'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'机构名称'}
            >
              {getFieldDecorator('org_id', {
                  rules: [{
                    required: true, message: '请选择机构',
                  }]
                }
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {orgList && orgList.map(item => <Option key={item.org_id} value={item.org_id}>{item.org_name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'区域名称'}
            >
              {getFieldDecorator('area_id', {
                  rules: [{
                    required: true, message: '请选择区域',
                  }]
                }
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {areaList && areaList.map(item => <Option key={item.area_id} value={item.area_id}>{item.area_name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'建筑名称'}
            >
              {getFieldDecorator('building_id', {}
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {buildingList && buildingList.map(item => <Option key={item.building_id} value={item.building_id}>{item.building_name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'选择楼层'}
            >
              {getFieldDecorator('floor', {}
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {floorList && floorList.map((item, idx) => <Option key={idx} value={item}>{item}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'房间编号'}
            >
              {getFieldDecorator('room_id', {}
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {Array.isArray(roomList) && roomList.map(item => <Option key={item.room_id} value={item.room_id}>{item.room_no}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'设备名称'}
            >
              {getFieldDecorator('device_id', {}
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {Array.isArray(deviceList) && deviceList.map(item => <Option key={item.device_id} value={item.device_id}>{item.device_name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'峰时段指标'}
            >
              {getFieldDecorator('peak_value', {
                  rules: [{
                    required: true, message: '请输入峰时段指标',
                  }]
                }
              )(
                <Input placeholder={'请输入峰时段指标'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'谷时段指标'}
            >
              {getFieldDecorator('trough_value', {
                  rules: [{
                    required: true, message: '请输入谷时段指标',
                  }]
                }
              )(
                <Input placeholder={'请输入谷时段指标'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'平时段指标'}
            >
              {getFieldDecorator('normal_value', {
                  rules: [{
                    required: true, message: '请输入平时段指标',
                  }]
                }
              )(
                <Input placeholder={'请输入平时段指标'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'报警阈值'}
            >
              {getFieldDecorator('day_limit_value', {
                  rules: [{
                    required: true, message: '请输入报警阈值',
                  }]
                }
              )(
                <Input placeholder={'请输入报警阈值'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'监测点描述'}
            >
              {getFieldDecorator('day_limit_value', {}
              )(
                <Input placeholder={'请输入监测点描述'}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'负责人'}
            >
              {getFieldDecorator('org_id', {
                  rules: [{
                    required: true, message: '请选择负责人',
                  }]
                }
              )(
                <Select style={{width: '100%'}} placeholder={'请选择'}>
                  {userList && userList.map(item => <Option key={item.user_id} value={item.user_id}>{item.user_name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}

export default AlarmForm
