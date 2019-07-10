import React, { Component } from 'react';
import { Card, Table, Form, Row, Button, Input, Col } from 'antd';
import { uploadData } from '@/services/device';
import styles from '@/components/TableList/TableList.less';

@Form.create()
class Data extends Component {
  state = {
    loading: true,
    data: [],
    pagination: {
      pageSize: 10,
      showQuickJumper: true,
      showSizeChanger: true,
    },
    selectedRowKeys: [],
    payload: {},
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      fixed: 'left',
      width: 100,
      key: 'deviceNo',
    },
    {
      title: '相',
      dataIndex: 'dsub',
      fixed: 'left',
      width: 50,
      key: 'dsub',
    },
    {
      title: '三相总有功电能',
      dataIndex: 'active_power_total',
      key: '12',
    },
    {
      title: '三相总无功电能',
      dataIndex: 'reactive_power_total',
      key: '13',
    },
    {
      title: '电流值',
      dataIndex: 'current',
      key: '1',
    },
    {
      title: '电压值',
      dataIndex: 'voltage',
      key: '2',
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: '3',
    },
    {
      title: '有功功率',
      dataIndex: 'active_power_val',
      key: '4',
    },
    {
      title: '无功功率',
      dataIndex: 'reactive_power_val',
      key: '5',
    },
    {
      title: '功率因数',
      dataIndex: 'power_factor',
      key: '6',
    },
    {
      title: '电度',
      dataIndex: 'power_val',
      key: '7',
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: '8',
    },
    {
      title: '湿度',
      dataIndex: 'humidity',
      key: '9',
    },
    {
      title: '线温',
      dataIndex: 'line_temp',
      key: '10',
    },
    {
      title: '线路漏电流',
      dataIndex: 'leakage',
      key: '11',
    },
    {
      title: '上报时间',
      dataIndex: 'time',
      fixed: 'right',
      key: 'time',
    },
  ];

  componentDidMount() {
    this.queryUploadData();
  }

  queryUploadData = (payload = { pageSize: 10 }) => {
    this.setState({
      loading: true,
    });
    uploadData(payload).then(data => {
      if (data) {
        const { pagination } = { ...this.state };
        const { totalRecords, pageNo, pageSize, list } = data.data.pageModel;
        pagination.total = totalRecords; // 总数
        pagination.current = pageNo;
        pagination.pageSize = pageSize;
        this.setState({
          data: list, // list 数据
          loading: false, // 加载状态
          pagination, // 分页
          payload,
        });
      }
    });
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { pagination: { pageSize } } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageRow: pageSize,
      };
      this.queryUploadData(values);
    });
  };

  /**
   * 翻页
   * @param pagination
   * @param filters
   * @param sorter
   */
  handleStandardTableChange = (pagination, filters, sorter) => {
    const { pagination: pager, payload } = { ...this.state };
    pager.pageSize = pagination.pageSize;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const params = { ...payload };
    params.pageNo = pager.current;
    params.sortField = sorter.field;
    params.sortOrder = sorter.order;
    params.pageSize = pager.pageSize;
    this.queryUploadData(params);
  };

  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.queryUploadData();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { payload } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <Form.Item label="设备名称">
              {getFieldDecorator('deviceName', {
                initialValue: payload.deviceName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Button icon="search" type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, data, pagination } = this.state;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <Table
            dataSource={data}
            scroll={{ x: 2000 }}
            pagination={pagination}
            loading={loading}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default Data;
