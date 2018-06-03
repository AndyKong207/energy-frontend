import React, {PureComponent, Fragment} from 'react'
import {Form, Select, Icon, Input, Button, Card, Row, Col, Tooltip} from 'antd'
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
  style: {marginBottom: 24, marginTop: 24},
};

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// function getActiveData() {
//   const activeData = [];
//   // for (let i = 0; i < 24; i += 1) {
//     activeData.push({
//       x: (new Date().getTime()) + (1000 * 60 * 30),
//       y1: Math.floor(Math.random() * 100) + 10,
//     });
//   // }
//   return activeData
// }

function getActiveData() {
  const offlineChartData = [];
  offlineChartData.push({
    x: (new Date().getTime()),
    y1: Math.floor(Math.random() * 40) + 80,
    // y2: Math.floor(Math.random() * 100) + 10,
  })
  return offlineChartData
}

const salesData = [];
// for (let i = 0; i < 12; i += 1) {
//   salesData.push({
//     x: `${i + 1}区`,
//     y: Math.floor(Math.random() * 1000) + 200,
//   });
// }

let rankingListData = [];
// for (let i = 0; i < 7; i += 1) {
//   rankingListData.push({
//     title: `工专路 ${i} 号店`,
//     total: 323234,
//   });
// }

const areaData = ['图书馆', '教学楼', '一食堂', '二食堂', '三食堂', '学生公寓1', '敬文书院', '电子楼']
for (const item of areaData) {
  salesData.push({
    x: item,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

for (const item of salesData) {
  rankingListData.push({
    title: item.x,
    total: item.y
  });
}

rankingListData = rankingListData.sort((a, b) => {
  return a - b
})

class RegionMonitor extends React.Component {
  state = {
    activeData: getActiveData(),
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => {
        return {
          activeData: prevState.activeData.concat(getActiveData())
        }
      });
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const {activeData} = this.state

    return (
      <Fragment>
        <Card bordered={false}>
          <AreaSearch/>
        </Card>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="能耗面积"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={`8920㎡`}
              footer={<Field label="能耗指标" value={`8423kWh`}/>}
              contentHeight={46}
            >
              <div></div>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="今日能耗"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={`16560kWh`}
              footer={<Field label="日均能耗" value={`12423kWh`}/>}
              contentHeight={46}
            >
              <Trend flag="up" style={{marginRight: 16}}>
                周同比<span>12%</span>
              </Trend>
              <Trend flag="down">
                日环比<span>11%</span>
              </Trend>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="今日能耗成本"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={yuan(126560)}
              footer={<Field label="日均成本" value={`￥${numeral(12423).format('0,0')}`}/>}
              contentHeight={46}
            >
              <Trend flag="up" style={{marginRight: 16}}>
                周同比<span>12%</span>
              </Trend>
              <Trend flag="down">
                日环比<span>11%</span>
              </Trend>
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <Card title="能耗实时监测" style={{marginBottom: 24}} bordered={false}>
              <TimelineChart
                height={400}
                data={activeData}
                titleMap={{y1: '总能耗'}}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card title="耗电时段分布" style={{marginBottom: 24}} bordered={false}>
              <Row style={{padding: '16px 0'}}>
                <Col span={8}>
                  <ColorfulGauge
                    title="峰时段"
                    height={200}
                    percent={500}
                  />
                </Col>
                <Col span={8}>
                  <ColorfulGauge
                    title="谷时段"
                    height={200}
                    percent={200}
                  />
                </Col>
                <Col span={8}>
                  <ColorfulGauge
                    title="平时段"
                    height={200}
                    percent={400}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Card title="区域耗能概览" style={{marginBottom: 24}} bordered={false}>
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={295} title="区域耗能" data={salesData}/>
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>区域耗能排名</h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={i}>
                      <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                      <span>{item.title}</span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}

export default RegionMonitor
