# 可视化建筑信息的采集与分析系统前端
## 快速开始
```bash
## 下载项目到本地    
git clone https://github.com/AndyKong207/energy-frontend.git

## 安装依赖包
npm install 或 yarn

## 运行项目
npm run start 或 yarn start

## 构建
npm run build 或 yarn build
````
## 开发技术
### 框架
* 前端框架：[React](https://reactjs.org/) 
* 页面样式框架：[ant-design](https://ant.design/)
* CSS样式：[less](http://lesscss.org/)
* 项目基于[roadhog](https://github.com/sorrycc/roadhog)脚手架搭建
* 图表：[BizCharts](https://github.com/alibaba/BizCharts)
> 使用以上技术之前必须先掌握以下技术  
> HTML5 CSS3 JavaScript(ES5 ES6 ES7)语法 [webpack](https://webpack.js.org/)
### 开发工具
* IDE环境：webstorm
* 代码版本控制：git
* 运行环境：Node.js(必须)
* js库管理工具：npm
### 部署环境
* 服务器系统：Linux ubuntu
* HTTP容器：nginx
## 项目目录结构
>.  
 ├── dist  构建生成的文件  
 │   └── static     
 ├── mock  假数据  
 ├── public  html入口  
 └── src  
     ├── assets  资源  
     ├── common  处理路由和菜单  
     ├── components  组件  
     │   ├── AreaSearch   
     │   ├── Charts  
     │   │   ├── Bar  
     │   │   ├── ChartCard  
     │   │   ├── ColorfulGauge  
     │   │   ├── Field  
     │   │   ├── Gauge  
     │   │   ├── MiniArea  
     │   │   ├── MiniBar  
     │   │   ├── MiniProgress  
     │   │   ├── Pie  
     │   │   ├── Radar  
     │   │   ├── TagCloud  
     │   │   ├── TimelineChart  
     │   │   └── WaterWave  
     │   ├── NumberInfo  
     │   ├── PageHeader  
     │   ├── SiderMenu  
     │   ├── StandardTable  
     │   ├── Trend  
     │   └── utils  
     ├── layouts  页面布局  
     ├── models  dva状态管理  
     ├── routes  路由  
     │   ├── Alarm  
     │   ├── Analysis  
     │   ├── Asset  
     │   ├── Monitor  
     │   ├── Setting  
     │   └── User  
     ├── services  后台请求接口  
     └── utils  工具  
