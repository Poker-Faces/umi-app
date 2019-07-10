import React, { Component, Suspense } from 'react';
import { Card, Col, Icon, Row, Tabs, Tooltip, Empty, Button } from 'antd';
import { Line } from 'bizcharts';
import styles from '../Data/Analysis.less';

const { TabPane } = Tabs;

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket('ws://39.105.14.244:9013/ws/monitor');
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

          </Card>
        </Suspense>
      </div>
    );
  }
}

export default Monitor;
