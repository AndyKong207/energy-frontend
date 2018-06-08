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
import {searchEnvironmentNew} from '../../services/environment'
import omit from 'lodash/omit'

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

function randomData() {
  return {
    x: (new Date().getTime()),
    y1: Math.floor(Math.random() * 40) + 80,
    // y2: Math.floor(Math.random() * 40) + 10
  }
}

function getActiveData() {
  const offlineChartData = [];
  offlineChartData.push(randomData())
  // offlineChartData.push({
  //   x: (new Date().getTime()),
  //   y1: Math.floor(Math.random() * 40) + 80,
  //   // y2: Math.floor(Math.random() * 100) + 10,
  // })
  return offlineChartData
}

function randomEnvData() {
  return {
    x: (new Date().getTime()),
    y1: Math.floor(Math.random() * 10) + 20,
    y2: Math.floor(Math.random() * 40) + 40,
    y3: Math.floor(Math.random() * 40) + 400,
    y4: Math.floor(Math.random() * 40) + 100,
    y5: Math.floor(Math.random() * 40) + 900,
    y6: Math.floor(Math.random() * 40) + 110,
    y7: Math.floor(Math.random() * 40) + 500
  }
}

function getActiveEnvData() {
  const charData = []
  charData.push(randomEnvData())
  return charData
}

const salesData = [];
// for (let i = 0; i < 12; i += 1) {
//   salesData.push({
//     x: `${i + 1}区`,
//     y: Math.floor(Math.random() * 1000) + 200,
//   });
// }

let rankingListData = [];

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
  return b.total - a.total
})

const envMap = {
  env_temperature: '温度',
  env_humidity: '湿度',
  env_co: '一氧化碳浓度',
  env_ch4: '甲烷浓度',
  env_lpg: '液化气浓度',
  env_atmospheric_pressure: '大气压强',
  env_illumination_intensity: '光照强度'
}

const envUnit = {
  env_temperature: '℃',
  env_humidity: '%RH',
  env_co: 'ppb',
  env_ch4: 'ppb',
  env_lpg: 'ppb',
  env_atmospheric_pressure: 'kPa',
  env_illumination_intensity: 'Lux'
}

// const envData = {
//   env_temperature: 29,
//   env_humidity: 76,
//   env_co: 490,
//   env_ch4: 160,
//   env_lpg: 950,
//   env_atmospheric_pressure: 125.927,
//   env_illumination_intensity: 599
// }

class RegionMonitor extends React.Component {
  state = {
    activeData: getActiveData(),
    environmentData: getActiveEnvData(),
    envData: null,
    envChartDataArr: []
  }

  componentDidMount() {
    let {activeData} = this.state
    this.timer = setInterval(() => {
      activeData.push(randomData())
      this.setState(prevState => {
        return {
          activeData: activeData,
        }
      })
      this.fetchEnvironment()
    }, 1000)

  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  async fetchEnvironment() {
    const envNew = await searchEnvironmentNew()
    const {envChartDataArr} = this.state
    if (envNew && Array.isArray(envNew)) {
      const data = omit(envNew[0], 'env_device_id', 'env_id')
      data.env_co = `${Number.parseFloat(data.env_co) * 1000}`
      data.env_ch4 = `${Number.parseFloat(data.env_ch4) * 1000}`
      data.env_lpg = `${Number.parseFloat(data.env_lpg) * 1000}`
      data.env_atmospheric_pressure = `${Number.parseInt(data.env_atmospheric_pressure) / 1000}`
      // data.env_illumination_intensity = 'Lux'
      const envChartData = {}
      let i = 1
      for (const item in data) {
        envChartData['y' + i] = data[item]
        i++
      }
      envChartData.x = (new Date().getTime())
      envChartDataArr.push(envChartData)
      this.setState(prevState => {
        return {
          envData: data,
          envChartDataArr: envChartDataArr
        }
      })
    }
  }

  render() {
    const {activeData, environmentData, envData, envChartDataArr} = this.state

    if (activeData.length > 50) {
      activeData.shift()
    }
    if (environmentData.length > 10) {
      environmentData.shift()
    }


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
                shape={'smooth'}
                type={'area'}
              />
            </Card>
          </Col>
        </Row>
        <Card title="环境实时监测" style={{marginBottom: 24}} bordered={false}>
          <Row gutter={24}>
            <Col md={18}>
              {Array.isArray(envChartDataArr) && envChartDataArr.length > 0 && <TimelineChart
                height={400}
                data={envChartDataArr}
                titleMap={{y1: '温度', y2: '湿度', y3: '一氧化碳', y4: '甲烷', y5: '液化气', y6: '大气压强', y7: '光照强度'}}
                shape={'line'}
                type={'line'}
                maxValue={1000}
              />}
            </Col>
            <Col md={6}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>环境监测数据</h4>
                <ul className={styles.envList}>
                  {
                    envData && Object.keys(envData).map((item, i) => (
                      <li key={i}>
                        <span>{envMap[item]}</span>
                        <span>{envData[item]} {envUnit[item]}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
        <Row>
          <Col>
            <Card title="峰谷时段耗电" style={{marginBottom: 24}} bordered={false}>
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
                <Bar height={295} title="区域耗能(kWh)" data={salesData}/>
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
                      <span>{numeral(item.total).format('0,0')}kWh</span>
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
