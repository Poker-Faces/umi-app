import React, {Component} from 'react';
import {Form, Row, Button, Input, Col} from 'antd';
import moment from 'moment';
import {queryCmdList} from '@/services/message';
import TableTemplate from "@/components/TableList/TableTemplate";

@Form.create()
class Cmd extends Component {

  columns = [
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
    },
    {
      title: '消息编号',
      dataIndex: 'cmdMsgId',
    },
    {
      title: '指令内容',
      width: 800,
      dataIndex: 'cmdContent',
      render: text => (<div style={{width: "800px", "word-wrap": "break-word"}}>{text}</div>),
    },
    {
      title: '下发时间',
      dataIndex: 'cmdSendTime',
      render: text => moment(text, "YYYYMMDDHHmmss").format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '响应时间',
      dataIndex: 'cmdResponseTime',
      render: text => moment(text, "YYYYMMDDHHmmss").format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  /**
   * 搜索区域
   * @returns {*}
   */
  renderSimpleForm = (form, handleSearch, handleReset) => (
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{md: 8, lg: 24, xl: 48}}>
        <Col md={4} sm={24}>
          <Form.Item label="设备编号">
            {form.getFieldDecorator('deviceNo')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Button icon="search" type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{marginLeft: 8}} onClick={handleReset}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );

  render() {
    const queryList = {
      queryList: queryCmdList,
      renderSimpleForm: this.renderSimpleForm
    };
    return (
      <TableTemplate
        {...queryList}
        columns={this.columns}
        listName="cmdList"
      />
    );
  }
}

export default Cmd;
