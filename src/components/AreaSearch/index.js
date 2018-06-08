import React, {Fragment} from 'react'
import {Select, Form, Button, Row, Col, DatePicker} from 'antd'
import {searchOrg} from '../../services/organization'
import {searchArea} from '../../services/area'
import {searchBuilding} from '../../services/building'
import {searchRoom} from '../../services/room'
import {searchUser} from "../../services/user";
import {searchDevice} from "../../services/device";

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

const submitFormLayout = {
  wrapperCol: { span: 10, offset: 7 }
}

@Form.create()
class AreaSearch extends React.Component {
  state = {
    orgList: [],
    areaList: [],
    buildingList: [],
    roomList: [],
  }
  async componentDidMount() {
    const orgList = await searchOrg()
    const areaList = await searchArea()
    const buildingList = await searchBuilding()
    const roomList = await searchRoom()
    this.setState({
      orgList,
      areaList,
      buildingList,
      roomList,
      floorList: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    })
  }
  render() {
    const {isShowDatePicker} = this.props
    const {getFieldDecorator} = this.props.form
    const {
      orgList,
      areaList,
      buildingList,
      roomList,
      floorList
    } = this.state
    return (
      <Fragment>
        <Form style={{width: '100%'}}>
          <Row>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="区域"
              >
                {
                  getFieldDecorator('a')(
                    <Select style={{width: '100%'}} placeholder={'请选择'}>
                      {areaList && areaList.map(item => <Option key={item.area_id} value={item.area_id}>{item.area_name}</Option>)}
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="建筑"
              >
                {
                  getFieldDecorator('b')(
                    <Select style={{width: '100%'}} placeholder={'请选择'}>
                      {buildingList && buildingList.map(item => <Option key={item.building_id} value={item.building_id}>{item.building_name}</Option>)}
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="楼层"
              >
                {
                  getFieldDecorator('a')(
                    <Select style={{width: '100%'}} placeholder={'请选择'}>
                      {floorList && floorList.map((item, idx) => <Option key={idx} value={item}>{item}</Option>)}
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="房间"
              >
                {
                  getFieldDecorator('a')(
                    <Select style={{width: '100%'}} placeholder={'请选择'}>
                      {Array.isArray(roomList) && roomList.map(item => <Option key={item.room_id} value={item.room_id}>{item.room_no}</Option>)}
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...submitFormLayout}>
                <Button type={'primary'} icon={'search'}>搜索</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
    )
  }
}

export default AreaSearch
