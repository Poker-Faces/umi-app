import React, { Component } from 'react';
import { Row, Col, Card, Form, Select } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './Analysis.less';
import TableList from '@/components/TableList/TableList.less';
import { Bar } from '@/components/Charts';
import { getDataCharts } from '@/services/message';


const { Option } = Select;

@Form.create()
class Statistics extends Component {
  state = {
    data: { warningCharts: [] },
    loading: false,
    date: '2019',
  };

  componentDidMount() {
    this.setState({ loading: true }); // 加载状态
    this.getDataCharts();
  }

  queryCharts = e => {
    this.getDataCharts({ date: e });
    this.setState({
      date: e,
    });
  };

  /**
   * 查询数据
   * @param payload
   * @returns {Promise<void | never>}
   */
  getDataCharts = payload => {
    this.setState({ loading: true }); // 加载状态
    return getDataCharts(payload).then(data => {
      if (data) {
        this.setState({
          loading: false, // 加载状态
          data: data.data,
        });
      }
    });
  };

  render() {
    const { loading, data, date } = this.state;
    const ds = new DataSet();
    const dv = ds.createView().source(data.warningCharts);
    dv.transform({
      type: 'fold',
      fields: ['电流报警', '电压报警', '温度报警', '线路报警', '漏电报警'],
      // 展开字段集
      key: 'status',
      // key字段
      value: 'device', // value字段
    });
    const cols = {
      x: {
        range: [0, 1],
      },
    };
    const {
      form: { getFieldDecorator },
    } = this.props;
    const date1 = `${date}年注册用户(单位：人)`;
    const date2 = `${date}年注册设备(单位：台)`;
    return (
      <Card loading={loading} bordered={false} bodyStyle={{ paddingTop: 30 }}>
        <div className={styles.salesCard}>
          <Row>
            <Col xl={24} lg={12} md={24} sm={24} xs={24}>
              <div className={TableList.tableListForm} style={{ paddingLeft: '32px' }}>
                <Form layout="inline">
                  <Form.Item label="选择年份">
                    {getFieldDecorator('date', {
                      initialValue: date,
                    })(
                      <Select onChange={this.queryCharts}>
                        <Option value="2019">2019</Option>
                        <Option value="2020">2020</Option>
                        <Option value="2021">2021</Option>
                        <Option value="2022">2022</Option>
                        <Option value="2023">2023</Option>
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                        <Option value="2027">2027</Option>
                        <Option value="2028">2028</Option>
                        <Option value="2029">2029</Option>
                        <Option value="2030">2030</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <h4>{date}年报警统计(单位：次)</h4>
                <Chart height={400} data={dv} scale={cols} forceFit padding="auto">
                  <Legend />
                  <Axis name="x" />
                  <Axis
                    name="device"
                  />
                  <Tooltip
                    crosshairs={{
                      type: 'y',
                    }}
                  />
                  <Geom
                    type="line"
                    position="x*device"
                    size={2}
                    color="status"
                    shape="smooth"
                  />
                  <Geom
                    type="point"
                    position="x*device"
                    size={3}
                    shape="circle"
                    color="status"
                    style={{
                      stroke: '#fff',
                      lineWidth: 1,
                    }}
                  />
                </Chart>
              </div>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={292}
                  title={date1}
                  data={data.userCharts}
                />
              </div>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={292}
                  title={date2}
                  data={data.deviceCharts}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}

export default Statistics;
