import React, { Component, Suspense } from 'react';
import { Card, Col, Icon, Row, Tabs, Tooltip, Empty, Button } from 'antd';
import { Line } from '@/components/Charts';
import { getServerPath } from '@/utils/utils';
import styles from '../Data/Analysis.less';

const { TabPane } = Tabs;

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket(`${getServerPath().wsServer}/ws/monitor`);
    this.state = {
      // formData: "一小时",
      socketData: {
        onlineDevice: [],
        receiveMessage: [],
        sendCMD: [],
      },
      loading: true,
    };
  }

  componentDidMount() {
    const conn = this.socket;
    // const { formData } = this.state;
    // conn.onopen = () => conn.send(formData);
    conn.onmessage = e => {
      const array = [];
      const data = JSON.parse(e.data);
      for (let i = 0; i < data.length; i += 1) {
        array.push({
          x: data[i].second,
          y: data[i].messageCount,
        });
        this.setState({
          socketData: {
            onlineDevice: [],
            receiveMessage: array,
            sendCMD: [],
          },
        });
      }
      this.setState({
        loading: false,
      });
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    const { history } = this.props;
    const { socketData, loading } = this.state;
    return (
      <div>
        <Suspense fallback={null}>
          <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
            <div className={styles.salesCard}>
              <Tabs>
                <TabPane tab="实时监控" key="sales">
                  {socketData.onlineDevice.length !== 0 || socketData.receiveMessage.length !== 0 || socketData.sendCMD.length !== 0 ?
                    <div>
                      <Row>
                        <Col>
                          <div className={styles.salesBar}>
                            {socketData.receiveMessage.length > 0 ?
                              <Line
                                height={295}
                                title={
                                  <span>
                                    平台接收消息&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Tooltip
                                      autoAdjustOverflow
                                      placement="right"
                                      title="从设备发送到物联网平台的消息，按协议类型区分；数据采集有一定延迟，周期是指两个采集点之间的时间间隔，显示的数值是采集周期内的累加值"
                                    >
                                      <Icon type="question-circle" theme="filled" />
                                    </Tooltip>
                                  </span>
                                }
                                data={socketData.receiveMessage}
                              />
                              : <Empty description={<span>平台接收消息暂无数据</span>} />}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className={styles.salesBar}>
                            {socketData.sendCMD.length > 0 ?
                              <Line
                                height={295}
                                title={
                                  <span>
                                    平台下发指令&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Tooltip
                                      autoAdjustOverflow
                                      placement="right"
                                      title="从物联网平台发送到设备和服务端的消息，按协议类型区分；数据采集有一定延迟，周期是指两个采集点之间的时间间隔，显示的数值是采集周期内的累加值"
                                    >
                                      <Icon type="question-circle" theme="filled" />
                                    </Tooltip>
                                  </span>
                                }
                                data={socketData.sendCMD}
                              />
                              : <Empty description={<span>平台下发指令暂无数据</span>} />}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    : <Empty description={<span>实时监控暂无数据</span>} style={{ paddingBottom: '20px' }}> <Button type="primary" onClick={() => history.replace('/')}>重新加载</Button> </Empty>}
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </Suspense>
      </div>
    );
  }
}

export default Monitor;
