import React, { Component } from 'react';
import { Form, Row, Button, Input, Col } from 'antd';
import moment from 'moment';
import { queryMessageList } from '@/services/message';
import TableTemplate from '@/components/TableList/TableTemplate';

@Form.create()
class News extends Component {
  columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户手机号',
      dataIndex: 'userPhone',
    },
    {
      title: '消息类型',
      dataIndex: 'messageType',
      render: text => {
        switch (text) {
          case '1':
            return '设备注册';
          case '2':
            return '设备共享';
          case '3':
            return '设备告警';
          default:
            return '';
        }
      },
    },
    // {
    //   title: '故障类型',
    //   dataIndex: 'messageFaultType',
    //   render: text => {
    //     switch (text) {
    //       case '1':
    //         return '非故障';
    //       case '2':
    //         return '过流报警';
    //       case '3':
    //         return '过压报警';
    //       case '4':
    //         return '线温报警';
    //       case '5':
    //         return '路温报警';
    //       case '6':
    //         return '滤波报警';
    //       case '7':
    //         return '其他报警';
    //       default:
    //         return '';
    //     }
    //   },
    // },
    {
      title: '阅读状态',
      dataIndex: 'messageStatus',
      render: text => {
        switch (text) {
          case '0':
            return '未读';
          case '1':
            return '已读';
          default:
            return '';
        }
      },
    },
    {
      title: '消息标题',
      dataIndex: 'messageTitle',
    },
    {
      title: '消息内容',
      dataIndex: 'messageContent',
    },
    {
      title: '发送时间',
      dataIndex: 'messageReceivTime',
      render: text => moment(text, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  /**
   * 搜索区域
   * @returns {*}
   */
  renderSimpleForm = (form, handleSearch, handleReset) => (
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={4} sm={24}>
          <Form.Item label="设备名称">
            {form.getFieldDecorator('deviceName')(<Input placeholder="请输入设备名称查询" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="用户名称">
            {form.getFieldDecorator('userName')(<Input placeholder="请输入用户名称查询" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="用户手机号">
            {form.getFieldDecorator('userPhone')(<Input placeholder="请输入用户手机号查询" />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Button icon="search" type="primary" htmlType="submit">
            {' '}
              查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
          </Button>
        </Col>
      </Row>
    </Form>
    );

  render() {
    const queryList = {
      queryList: queryMessageList,
      renderSimpleForm: this.renderSimpleForm,
    };
    return (
      <TableTemplate
        {...queryList}
        columns={this.columns}
        listName="messageList"
      />
    );
  }
}

export default News;
