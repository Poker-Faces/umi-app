import React, { Component, Fragment } from 'react';
import { Divider, Form, Row, Button, Input, Col, message } from 'antd';
import moment from 'moment';
import { queryParamList, switchParamStatus } from '@/services/config';
import styles from '@/components/TableList/TableList.less';
import EditParams from './EditParams';
import TableTemplate from '@/components/TableList/TableTemplate';

@Form.create()
class Params extends Component {
  state = {
    editModalVisible: false,
    editFormValues: {},
  };

  columns = [
    {
      title: '参数名称',
      dataIndex: 'paraname',
    },
    {
      title: '参数描述',
      dataIndex: 'paradesc',
    },
    {
      title: '参数值',
      dataIndex: 'paravalue',
    },
    {
      title: '参数值描述',
      dataIndex: 'valuedesc',
    },
    {
      title: '参数状态',
      dataIndex: 'status',
      render: text => {
        switch (text) {
          case '0':
            return '停用';
          case '1':
            return '启用';
          default:
            return '';
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'regtime',
      render: text => moment(text, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          {record.status === '1' ? <a onClick={() => this.switchParam({ paraname: record.paraname })}>停用</a> :
          <a onClick={() => this.switchParam({ paraname: record.paraname })}>启用</a>}
        </Fragment>
      ),
    },
  ];

  /**
   * 获取子组件方法
   * @param ref
   */
  onRef = ref => {
    this.TableTemplate = ref;
  };

  /**
   * 刷新页面
   */
  refreshPage = () => {
    // 获取查询参数
    const params = this.TableTemplate.getParams();
    this.TableTemplate.queryListFetch(params);
  };

  /**
   * 启用停用参数
   * @param paramname
   */
  switchParam = paramname => switchParamStatus(paramname).then(data => {
    if (data) {
      message.success('设置成功');
      this.refreshPage();
    }
  });

  /**
   * 编辑信息
   * @param flag
   * @param record
   */
  handleEditModalVisible = (flag, record) => {
    this.setState({
      editModalVisible: flag,
      editFormValues: record || {},
    });
    this.refreshPage();
  };

  /**
   * 查询模块
   * @returns {*}
   */
  renderSimpleForm=(form, handleSearch, handleReset, handleEditModalVisible) => (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={4} sm={24}>
          <Form.Item label="参数名称">
            {form.getFieldDecorator('paraname')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="参数描述">
            {form.getFieldDecorator('paradesc')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="参数值">
            {form.getFieldDecorator('paravalue')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button icon="search" type="primary" id="1" onClick={handleSearch}>
                查询
            </Button>
            <Button style={{ marginLeft: 8 }} id="2" onClick={handleReset}>
                重置
            </Button>
            <Button
              type="primary"
              icon="plus"
              style={{ marginLeft: 8, marginBottom: 10 }}
              onClick={() => handleEditModalVisible(true, {})}
            >
                添加参数
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
    )

  render() {
    const { editModalVisible, editFormValues } = this.state;
    const handle = {
      handleEditModalVisible: this.handleEditModalVisible,
    };
    const queryList = {
      queryList: queryParamList,
      renderSimpleForm: this.renderSimpleForm,
      handleEditModalVisible: this.handleEditModalVisible,
    };
    return (
      <div>
        <TableTemplate
          {...queryList}
          columns={this.columns}
          listName="paramList"
          onRef={this.onRef}
        />
        <EditParams
          {...handle}
          editModalVisible={editModalVisible}
          editFormValues={editFormValues}
        />
      </div>
    );
  }
}

export default Params;
