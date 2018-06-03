import React, {PureComponent, Fragment} from 'react'
import {Form, Select, Icon, Input, Button, Card, Row, Col, Tooltip, Tabs} from 'antd'
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
import numeral from 'numeral'
import styles from '../Monitor/RegionMonitor.less'

const { TabPane } = Tabs

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
  style: {marginBottom: 24, marginTop: 24},
};

const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
    y3: Math.floor(Math.random() * 100) + 10
  });
}
const salesData = []
const areaData = ['图书馆', '教学楼', '一食堂', '二食堂', '三食堂', '学生公寓1', '敬文书院', '电子楼']
for (const item of areaData) {
  salesData.push({
    x: item,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

class RegionAnalysis extends React.Component {
  render() {
    return (
      <Fragment>
        <Card
          bordered={false}
        >
          <AreaSearch isShowDatePicker={true}/>

          <Card bordered={false} bodyStyle={{ padding: 0 }}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
                <TabPane tab="同比" key="1">
                  <Row>
                    <Col span={24}>
                      <div className={styles.salesBar}>
                        <TimelineChart
                          height={400}
                          data={offlineChartData}
                          titleMap={{ y1: '2017年5月', y2: '2018年5月' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="环比" key="2">
                  <Row>
                    <Col span={24}>
                      <div className={styles.salesBar}>
                        <Bar height={295} title="区域耗能" data={salesData} />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="对比" key="3">
                  <Row>
                    <Col span={24}>
                      <div className={styles.salesBar}>
                        <Bar height={295} title="区域耗能" data={salesData} />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </Card>
      </Fragment>
    )
  }
}

export default RegionAnalysis
