import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, DatePicker } from 'antd';
import moment from 'moment';
import { queryUpList } from '@/services/message';
import TableTemplate from '@/components/TableList/TableTemplate';

const { RangePicker } = DatePicker;

@Form.create()
class UP extends Component {
  state = {
    startDate: '', endDate: '',
  };

  columns = [
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
    },
    {
      title: '上报内容',
      width: 800,
      dataIndex: 'upContent',
      render: text => (<div style={{ width: '800px', wordWrap: 'break-word' }}>{text}</div>),
    },
    {
      title: '创建时间',
      dataIndex: 'regTime',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];


  /**
   * 搜索区域
   * @returns {*}
   */
  renderSimpleForm = (form, handleSearch, handleReset, setText) => (
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={4} sm={24}>
          <Form.Item label="设备编号">
            {form.getFieldDecorator('deviceNo')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="创建时间">
            <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime onChange={setText} />
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Button icon="search" type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );

  /**
   * 设置日期值
   * @param value
   * @param dateString
   */
  setText = (value, dateString) => {
    this.setState({
      startDate: dateString[0], endDate: dateString[1],
    });
  };


  render() {
    const queryList = {
      queryList: queryUpList,
      renderSimpleForm: this.renderSimpleForm,
      handleEditModalVisible: this.setText,
    };
    const { startDate, endDate } = this.state;
    return (
      <TableTemplate
        {...queryList}
        columns={this.columns}
        listName="upList"
        startDate={startDate}
        endDate={endDate}
      />
    );
  }
}

export default UP;
