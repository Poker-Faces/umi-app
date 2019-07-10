import React, { PureComponent } from 'react';
import { Card, Form, Input, message, Button } from 'antd/lib/index';
import { updateUserInfo } from '@/services/user';
import { connect } from 'dva';

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
@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['userLogin/login'],
}))
class EditUserInfo extends PureComponent {
  /**
   *提交信息
   *
   * @memberof UserConfig
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const param = { ...fieldsValue };
      updateUserInfo(param).then(data => {
        if (data) {
          message.success('修改成功');
          window.location.reload();
        }
      });
    });
  };

  render() {
    const {
      user: { currentUser },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card bordered={false}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('userId', {
              initialValue: currentUser.userId,
            })(<Input hidden/>)}
          </Form.Item>

          <Form.Item label="登录账号">
            {getFieldDecorator('userPhone', {
              initialValue: currentUser.userPhone,
            })(<Input placeholder="登录账号" readOnly/>)}
          </Form.Item>

          <Form.Item label="登录姓名">
            {getFieldDecorator('userName', {
              initialValue: currentUser.userName,
              rules: [
                {
                  required: true,
                  message: '用户名称不能为空',
                  // pattern
                },
              ],
            })(<Input placeholder="请输入用户名称"/>)}
          </Form.Item>

          <Form.Item label="修改密码">
            {getFieldDecorator('userPassword')(<Input placeholder="请输入新密码"/>)}
          </Form.Item>

          <Form.Item label="公司名称">
            {getFieldDecorator('userCompany', {
              initialValue: currentUser.userCompany,
            })(<Input placeholder="请输入公司名称"/>)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>

      </Card>
    );
  }
}

export default EditUserInfo;
