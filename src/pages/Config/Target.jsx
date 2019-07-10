import React, { Component, Fragment } from 'react';
import { Form, Row, Button, Input, Col } from 'antd';
import { queryTargetlist } from '@/services/config';
import EditTarget from './EditTarget';
import TableTemplate from '@/components/TableList/TableTemplate';

@Form.create()
class Target extends Component {
  state = {
    editModalVisible: false,
    editFormValues: {},
  };

  columns = [
    {
      title: '指标编号',
      dataIndex: 'targetCode',
    },
    {
      title: '指标名称',
      dataIndex: 'targetName',
    },
    {
      title: '指标相名称',
      dataIndex: 'targetItemName',
    },
    {
      title: '指标类型',
      dataIndex: 'targetType',
      // eslint-disable-next-line no-nested-ternary
      render: text => (text === '1' ? '单一指标' : '' || text === '2' ? '上下限指标' : ''),
    },
    {
      title: '设备相型',
      dataIndex: 'targetDevicePhase',
    },
    {
      title: '设备用法',
      dataIndex: 'targetDeviceUseType',
      // eslint-disable-next-line no-nested-ternary
      render: text => (text === '1' ? '主路' : '' || text === '2' ? '支路' : '' || text === '3' ? '通用' : ''),
    },
    {
      title: '报警阀值上限',
      dataIndex: 'upValue',
    },
    {
      title: '报警阀值下限',
      dataIndex: 'downValue',
    },
    {
      title: '指标单位',
      dataIndex: 'targetUnit',
    },
    {
      title: '操作',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
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
   * 搜索区域
   * @returns {*}
   */
  renderSimpleForm = (form, handleSearch, handleReset) => (
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={4} sm={24}>
          <Form.Item label="指标名称">
            {form.getFieldDecorator('targetName')(<Input placeholder="请输入指标名称查询" />)}
          </Form.Item>
        </Col>
        <Col md={4} sm={24}>
          <Form.Item label="指标编号">
            {form.getFieldDecorator('targetCode')(<Input placeholder="请输入指标编号查询" />)}
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

  render() {
    const handle = {
      handleEditModalVisible: this.handleEditModalVisible,
    };
    const queryList = {
      queryList: queryTargetlist,
      renderSimpleForm: this.renderSimpleForm,
    };
    const { editModalVisible, editFormValues } = this.state;
    return (
      <div>
        <TableTemplate
          {...queryList}
          columns={this.columns}
          listName="targetList"
          onRef={this.onRef}
        />
        <EditTarget
          {...handle}
          editModalVisible={editModalVisible}
          editFormValues={editFormValues}
        />
      </div>
    );
  }
}

export default Target;
