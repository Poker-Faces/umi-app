import React, { Component } from 'react';
import { Form, Row, Button, Input, Col } from 'antd';
import moment from 'moment';
import { queryDeviceProductList } from '@/services/device';
import TableTemplate from '@/components/TableList/TableTemplate';

@Form.create()
class Product extends Component {
  columns = [
    {
      title: 'logo',
      dataIndex: 'productImageUrl',
      width: 100,
      render: text => <img src={text} alt="产品logo" style={{ width: '100%' }} />,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '产品描述Android',
      width: 400,
      dataIndex: 'productDescAndroid',
    },
    {
      title: '产品描述IOS',
      width: 400,
      dataIndex: 'productDescIphone',
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
          <Form.Item label="产品名称">
            {form.getFieldDecorator('productName')(<Input placeholder="请输入产品名称查询" />)}
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

  render() {
    const queryList = {
      queryList: queryDeviceProductList,
      renderSimpleForm: this.renderSimpleForm,
    };
    return (
      <TableTemplate
        {...queryList}
        columns={this.columns}
        listName="productList"
      />
    );
  }
}

export default Product;
