import React, { Component } from 'react';
import { Form, Row, Button, Input, Select, Col } from 'antd';
import moment from 'moment';
import { queryDeviceShareList } from '@/services/device';
import TableTemplate from '@/components/TableList/TableTemplate';

const { Option } = Select;

@Form.create()
class Share extends Component {
  columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '分享人',
      dataIndex: 'ownerUserName',
    },
    {
      title: '接受人',
      dataIndex: 'receiveUserName',
    },
    {
      title: '开关权限',
      dataIndex: 'relayPower',
      render: text => {
        switch (text) {
          case '0':
            return '无';
          case '1':
            return '有';
          default:
            return '';
        }
      },
    },
    {
      title: '监控权限',
      dataIndex: 'monitorPower',
      render: text => {
        switch (text) {
          case '0':
            return '无';
          case '1':
            return '有';
          default:
            return '';
        }
      },
    },
    {
      title: '查询权限',
      dataIndex: 'queryPower',
      render: text => {
        switch (text) {
          case '0':
            return '无';
          case '1':
            return '有';
          default:
            return '';
        }
      },
    },
    {
      title: '分享状态',
      dataIndex: 'shareStatus',
      render: text => {
        switch (text) {
          case '0':
            return '待确认';
          case '1':
            return '已接收';
          case '2':
            return '已拒绝';
          case '3':
            return '已取消';
          default:
            return '';
        }
      },
    },
    {
      title: '分享时间',
      dataIndex: 'regTime',
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
          <Form.Item label="分享人名称">
            {form.getFieldDecorator('ownerUserName')(<Input placeholder="请输入分享人名称查询" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="接收人名称">
            {form.getFieldDecorator('receiveUserName')(<Input placeholder="请输入接收人名称查询" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="分享状态">
            {form.getFieldDecorator('shareStatus', {
                initialValue: '',
              })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value="0">待确认</Option>
                  <Option value="1">已接收</Option>
                  <Option value="2">已拒绝</Option>
                  <Option value="3">已取消</Option>
                </Select>,
              )}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="设备名称">
            {form.getFieldDecorator('deviceName')(<Input placeholder="请输入设备名称查询" />)}
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
      queryList: queryDeviceShareList,
      renderSimpleForm: this.renderSimpleForm,
    };
    return (
      <TableTemplate
        {...queryList}
        columns={this.columns}
        listName="shareList"
      />
    );
  }
}

export default Share;
