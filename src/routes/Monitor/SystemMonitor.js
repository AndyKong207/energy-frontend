import React, { PureComponent, Fragment } from 'react'
import { Form, Select, Icon, Input, Button, Card, Row, Col, Tooltip, Radio } from 'antd'
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  Gauge,
  ColorfulGauge,
  TimelineChart,
} from '../../components/Charts'
import Trend from '../../components/Trend'
import AreaSearch from '../../components/AreaSearch'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import numeral from 'numeral';
import styles from './RegionMonitor.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
  style: { marginBottom: 24, marginTop: 24 },
};

const salesTypeData = [
  {
    x: '图书馆',
    y: 4544,
  },
  {
    x: '本科公寓',
    y: 3321,
  },
  {
    x: '一食堂',
    y: 3113,
  },
  {
    x: '电子学院',
    y: 2341,
  },
  {
    x: '教学楼',
    y: 1231,
  },
  {
    x: '其他',
    y: 1231,
  },
];

const salesTypeDataOnline = [
  {
    x: '图书馆',
    y: 244,
  },
  {
    x: '本科公寓',
    y: 321,
  },
  {
    x: '一食堂',
    y: 311,
  },
  {
    x: '电子学院',
    y: 41,
  },
  {
    x: '教学楼',
    y: 121,
  },
  {
    x: '其他',
    y: 111,
  },
];

const salesTypeDataOffline = [
  {
    x: '图书馆',
    y: 99,
  },
  {
    x: '一食堂',
    y: 188,
  },
  {
    x: '电子学院',
    y: 344,
  },
  {
    x: '教学楼',
    y: 255,
  },
  {
    x: '其他',
    y: 65,
  },
];

const totalData = [
  {
    x: '空调系统',
    y: 3534,
  },
  {
    x: '电梯系统',
    y: 6456,
  },
  {
    x: '照明系统',
    y: 2344,
  }
]

const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
    y3: Math.floor(Math.random() * 100) + 10
  });
}

class SystemMonitor extends React.Component {

  state = {
    salesType: 'all',
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  render() {
    const { salesType } = this.state;
    const salesPieData =
      salesType === 'all'
        ? salesTypeData
        : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="照明系统今日能耗"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`292kWh`}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="空调系统今日能耗"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`435kWh`}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="电梯系统今日能耗"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`892kWh`}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <Card title="系统能耗实时监测" style={{ marginBottom: 24 }} bordered={false}>
              <TimelineChart
                height={400}
                data={offlineChartData}
                titleMap={{ y1: '照明系统', y2: '空调系统', y3: '电梯系统' }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title={'今日能耗总量系统分布'} style={{ marginBottom: 24 }} style={{ minHeight: 509 }}>
              <Pie
                hasLegend
                // subTitle="销售额"
                // total={salesTypeData.reduce((pre, now) => now.y + pre, 0)}
                data={totalData}
                valueFormat={val => `${val}kWh`}
                height={248}
                // lineWidth={4}
                inner={0}
                showLabel={true}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.salesCard}
              bordered={false}
              title="今日各系统能耗区域分布"
              bodyStyle={{ padding: 24 }}
              extra={
                <div className={styles.salesCardExtra}>
                  <div className={styles.salesTypeRadio}>
                    <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                      <Radio.Button value="all">电梯系统</Radio.Button>
                      <Radio.Button value="online">照明系统</Radio.Button>
                      <Radio.Button value="offline">空调系统</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              }
              style={{ minHeight: 509 }}
            >
              <Pie
                hasLegend
                subTitle="能耗分布"
                total={salesPieData.reduce((pre, now) => now.y + pre, 0)}
                data={salesPieData}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default SystemMonitor
