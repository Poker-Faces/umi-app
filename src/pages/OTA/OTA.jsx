import React, { Component, Fragment } from 'react';
import { Card, Divider, Table, Form, Row, Select, Button } from 'antd';
import styles from '@/components/TableList/TableList.less';
import { queryOTAList } from '@/services/device';
import InsertOneOta from './InsertOneOta';

const { Option } = Select;

class OTA extends Component {
  state = {
    data: {
      list: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
      },
    },
    loading: true,
    editModalVisible: false,
    editFormValues: {},
  };

  columns = [
    {
      title: '固件名称',
      dataIndex: 'gujianmc',
    },
    {
      title: '固件版本号',
      dataIndex: 'gujianbbh',
    },
    {
      title: '所属产品',
      dataIndex: 'suoshucp',
    },
    {
      title: '添加时间',
      dataIndex: 'tianjiasj',
    },
    {
      title: '状态',
      dataIndex: 'zhuangtai',
    },
    {
      title: '固件签名',
      dataIndex: 'gujianqm',
    },
    {
      title: '操作',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.showConfirm(true, record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.update(true, record)}>升级</a>
        </Fragment>
      ),
    },
  ];

  renderSimpleForm = () => (
    <Form onSubmit={this.handleSearch} layout="inline">
      <Row>
        <Form.Item label="所属产品">
          {/* {getFieldDecorator('suoshuchanp')()} */}
          <Select showSearch style={{ width: '200px' }} defaultValue="1">
            <Option value="1">产品1</Option>
            <Option value="2">产品2</Option>
          </Select>
        </Form.Item>
      </Row>
    </Form>
  );

  handleEditModalVisible = (flag, record) => {
    this.setState({
      editModalVisible: flag,
      editFormValues: record || {},
    });
  };

  componentDidMount = () => {
    queryOTAList('2').then(
      data => {
        const dataList = {
        };
        this.setState({
          data: dataList,
          loading: false,
        });
      },
      err => {
        throw new Error(err);
      },
    );
  };

  render() {
    const handle = {
      handleEditModalVisible: this.handleEditModalVisible,
    };
    const {
      loading,
      data: { list, pagination },
      editModalVisible,
      editFormValues,
    } = this.state;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Button
                type="primary"
                icon="plus"
                style={{ marginLeft: 8, marginBottom: 10 }}
                onClick={() => this.handleEditModalVisible(true, {})}
              >
                新增固件
              </Button>
            </div>
            <Table
              filterMultiple={false}
              onSelectRow={this.handleSelectRows}
              dataSource={list}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <InsertOneOta
          {...handle}
          editModalVisible={editModalVisible}
          editFormValues={editFormValues}
        />
    </div>
    );
  }
}

export default OTA;
