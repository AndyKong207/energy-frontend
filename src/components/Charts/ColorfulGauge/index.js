import React from 'react';
import {Chart, Geom, Axis, Coord, Guide, Shape} from 'bizcharts';
import autoHeight from '../autoHeight';

const {Arc, Html, Line} = Guide;

const defaultFormatter = (val) => {
  switch (val) {
    case '2':
      return '差';
    case '4':
      return '中';
    case '6':
      return '良';
    case '8':
      return '优';
    default:
      return '';
  }
};

function creatData() {
  const data = [];
  let val = Math.random() * 6;
  val = val.toFixed(1);
  data.push({value: val * 1});
  return data;
}

let data = creatData();


// 自定义Shape 部分
Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0
    });
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y - 20,
        stroke: cfg.color,
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 12,
        stroke: cfg.color,
        lineWidth: 4.5,
        fill: '#fff'
      }
    });
  }
});

const color = ['#0086FA', '#FFBF00', '#F5222D'];
const cols = {
  'value': {
    min: 0,
    max: 6,
    tickInterval: 1,
    nice: false
  }
}

@autoHeight()
export default class Gauge extends React.Component {
  constructor() {
    super();
    this.state = {
      data: data,
      lineWidth: 25,
    }
  }

  componentDidMount() {
    const self = this;
    setInterval(function () {
      data = creatData();
      self.setState({
        data: data
      })
    }, 1000);
  }

  render() {
    const {title, height, percent} = this.props
    const {lineWidth} = this.state;
    const val = percent / 100;
    const data = [{ value: percent / 100 }];
    return (
      <Chart height={height} data={data} scale={cols} padding={[0, 0, 16, 0]} forceFit>
        <Coord type='polar' startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75}/>
        <Axis name='value'
              zIndex={2}
              line={null}
              label={{
                offset: -20,
                textStyle: {
                  fontSize: 18,
                  fill: '#CBCBCB',
                  textAlign: 'center',
                  textBaseline: 'middle'
                }
              }}
              tickLine={{
                length: -24,
                stroke: '#fff',
                strokeOpacity: 1
              }}
        />
        <Axis name="1" visible={false}/>
        <Guide>
          <Arc zIndex={0} start={[0, 0.965]} end={[6, 0.965]}
               style={{ // 底灰色
                 stroke: 'rgba(0, 0, 0, 0.09)',
                 lineWidth
               }}/>
          {val >= 2 && <Arc zIndex={1} start={[0, 0.965]} end={[val, 0.965]}
                            style={{ // 底灰色
                              stroke: color[0],
                              lineWidth
                            }}/>}
          {val >= 4 && <Arc zIndex={1} start={[2, 0.965]} end={[4, 0.965]}
                            style={{ // 底灰色
                              stroke: color[1],
                              lineWidth
                            }}/>}
          {val >= 4 && val < 6 && <Arc zIndex={1} start={[4, 0.965]} end={[val, 0.965]}
                                       style={{ // 底灰色
                                         stroke: color[2],
                                         lineWidth
                                       }}/>}
          {val >= 2 && val < 4 && <Arc zIndex={1} start={[2, 0.965]} end={[val, 0.965]}
                                       style={{ // 底灰色
                                         stroke: color[1],
                                         lineWidth
                                       }}/>}
          {val < 2 && <Arc zIndex={1} start={[0, 0.965]} end={[val, 0.965]}
                           style={{ // 底灰色
                             stroke: color[0],
                             lineWidth
                           }}/>}
          <Html
            position={['50%', '95%']}
            html={() => {
              return `
                <div style="width: 300px;text-align: center;font-size: 12px!important;">
                  <p style="font-size: 14px; color: rgba(0,0,0,0.43);margin: 0;">${title}</p>
                  <p style="font-size: 24px;color: rgba(0,0,0,0.85);margin: 0;">
                    ${data[0].value * 100}kWh
                  </p>
                </div>`;
            }}
          />
        </Guide>
        <Geom type="point" position="value*1" shape='pointer' color='#1890FF'
              active={false}
              style={{stroke: '#fff', lineWidth: 1}}
        />
      </Chart>);
  }
}
