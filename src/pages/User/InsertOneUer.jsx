import React, { PureComponent } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createUser, updateUserInfo } from '@/services/user';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@Form.create()
class InsertOneUer extends PureComponent {
  /**
   *提交信息
   *
   * @memberof UserConfig
   */
  handleSubmit = () => {
    const { form, userInfo, handleEditModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const param = {
        ...fieldsValue,
      };
      if (userInfo.userId) {
        param.userId = userInfo.userId;
        updateUserInfo(param).then(data => {
          if (data) {
            message.success('编辑成功');
          }
        });
      } else {
        createUser(param).then(data => {
          if (data) {
            message.success('新增成功');
          }
        });
      }
      // 关闭弹窗
      handleEditModalVisible(false, {});
    });
  };

  render() {
    const {
      userInfo,
      editModalVisible,
      form: { getFieldDecorator },
      handleEditModalVisible,
    } = this.props;
    return (
      <Modal
        width={700}
        bodyStyle={{ padding: 'auto' }}
        destroyOnClose
        title={userInfo.userId ? '编辑用户信息' : '新增后台用户'}
        visible={editModalVisible}
        onOk={this.handleSubmit}
        onCancel={() => handleEditModalVisible(false, {})}
      >
        <Form {...formItemLayout}>
          <Form.Item label="登录账号">
            {getFieldDecorator('userPhone', {
              initialValue: userInfo.userPhone,
            })(
              userInfo.userId ? (
                <Input placeholder="登录账号" readOnly />
              ) : (
                <Input placeholder="登录账号" />
              )
            )}
          </Form.Item>

          {!userInfo.userId ? (
            <Form.Item label="登录密码">
              {getFieldDecorator('userPassword', {
                initialValue: userInfo.userPassword,
                rules: [
                  {
                    required: true,
                    message: '登录密码不能为空',
                    // pattern
                  },
                ],
              })(<Input placeholder="请输入登录密码" />)}
            </Form.Item>
          ) : null}

          <Form.Item label="用户名称">
            {getFieldDecorator('userName', {
              initialValue: userInfo.userName,
              rules: [
                {
                  required: true,
                  message: '用户名称不能为空',
                  // pattern
                },
              ],
            })(<Input placeholder="请输入用户名称" />)}
          </Form.Item>

          <Form.Item label="用户公司名称">
            {getFieldDecorator('userCompany', {
              initialValue: userInfo.userCompany,
            })(<Input placeholder="请输入用户公司名称" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default InsertOneUer;
