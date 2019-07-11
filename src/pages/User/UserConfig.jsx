import React, { Component, Fragment } from 'react';
import { Form, Row, Button, Input, Divider, Col, Modal, message } from 'antd';
import moment from 'moment';
import { queryUserList, deleteUser, reSetPassword } from '@/services/user';
import InsertOneUser from './InsertOneUer';
import TableTemplate from '@/components/TableList/TableTemplate';

const { confirm } = Modal;

@Form.create()
class UserConfig extends Component {
  state = {
    editModalVisible: false,
    userInfo: {},
  };

  columns = [
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户手机号',
      dataIndex: 'userPhone',
    },
    {
      title: '用户公司',
      dataIndex: 'userCompany',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      // eslint-disable-next-line no-nested-ternary
      render: text => (text === '1' ? '后台用户' : '前端用户'),
    },
    {
      title: '用户状态',
      dataIndex: 'userStatus',
      render: text => {
        switch (text) {
          case '0':
            return '无效';
          case '1':
            return '有效';
          default:
            return '';
        }
      },
    },
    {
      title: '注册IP',
      dataIndex: 'regIp',
    },
    {
      title: '注册时间',
      dataIndex: 'regTime',
      render: text => moment(text, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 200,
      render: (text, record) => {
        let option = (
          <Fragment>
            <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
          </Fragment>
        );
        // 后台用户才可以删除和重置密码
        if (record.userType === '1' && record.userStatus === '1') {
          option = (
            <Fragment>
              <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.showConfirm('delete', record)}>删除</a>
              <Divider type="vertical" />
              <a onClick={() => this.showConfirm('reset', record)}>重置密码</a>
            </Fragment>
          );
        }
        return <div>{option}</div>;
      },
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
   *二次确认 弹窗
   *
   * @memberof UserConfig
   */
  showConfirm = (text, record) => {
    confirm({
      title: '操作确认',
      content:
        text === 'reset'
          ? `您确定要重置${record.userName}的密码吗？`
          : `您确定要删除${record.userName}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const userId = { userId: record.userId };
        if (text === 'reset') {
          reSetPassword(userId).then(data => {
            if (data) {
              message.success('密码重置成功，新密码：123456');
            }
          });
        } else {
          deleteUser(userId).then(data => {
            if (data) {
              message.success('删除成功');
              this.refreshPage();
            }
          });
        }
      },
      onCancel() {
      },
    });
  };


  /**
   *展示编辑信息对话框
   *
   * @memberof UserConfig
   */
  handleEditModalVisible = (flag, userInfo) => {
    this.setState({
      editModalVisible: flag,
      userInfo,
    });
    if (!flag) {
      this.refreshPage();
    }
  };

  /**
   * 搜索区域
   * @returns {*}
   */
  renderSimpleForm = (form, handleSearch, handleReset, handleEditModalVisible) => (
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
              查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
          </Button>
          <Button
            icon="plus"
            type="primary"
            style={{ marginLeft: 20 }}
            onClick={() => handleEditModalVisible(true, {})}
          >
              新增后台用户
          </Button>
        </Col>
      </Row>
    </Form>
    );

  render() {
    const { userInfo, editModalVisible } = this.state;
    const handle = {
      handleEditModalVisible: this.handleEditModalVisible,
      queryUserList: this.queryUserList,
    };

    const queryList = {
      queryList: queryUserList,
      renderSimpleForm: this.renderSimpleForm,
      handleEditModalVisible: this.handleEditModalVisible,
    };
    return (
      <div>
        <TableTemplate
          {...queryList}
          columns={this.columns}
          listName="userList"
          onRef={this.onRef}
        />

        <InsertOneUser {...handle} userInfo={userInfo} editModalVisible={editModalVisible} />
      </div>

    );
  }
}

export default UserConfig;
