import React, { Component } from 'react';
import { Form, Row, Button, Input, Col } from 'antd';
import moment from 'moment';
import { queryDeviceGroupList } from '@/services/device';
import TableTemplate from '@/components/TableList/TableTemplate';

@Form.create()
export default class Grouping extends Component {
  columns = [
    {
      title: '分组名称',
      dataIndex: 'groupName',
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
      title: '创建时间',
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
          <Form.Item label="分组名称">
            {form.getFieldDecorator('groupName')(<Input placeholder="请输入分组名称查询" />)}
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
      queryList: queryDeviceGroupList,
      renderSimpleForm: this.renderSimpleForm,
    };
    return (
      <TableTemplate
        {...queryList}
        columns={this.columns}
        listName="groupList"
      />
    );
  }
}
