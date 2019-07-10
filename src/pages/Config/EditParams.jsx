import React, { PureComponent } from 'react';
import { Modal, Form, Input, Tooltip, Icon, message, Select } from 'antd';
import { updateParamInfo, createParam } from '@/services/config';

const { Option } = Select;
const { TextArea } = Input;
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
class EditParams extends PureComponent {
  // 保存信息
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.saveInfo(values);
      }
    });
  };

  /**
   * 保存信息
   */
  saveInfo = payload => {
    const { handleEditModalVisible, editFormValues } = this.props;
    if (editFormValues.paraname) {
      return updateParamInfo(payload).then(data => {
        if (data) {
          handleEditModalVisible(false, payload); // 关闭dialog窗口
          message.success('保存成功');
        }
      });
    }
    return createParam(payload).then(data => {
      if (data) {
        handleEditModalVisible(false, payload); // 关闭dialog窗口
        message.success('保存成功');
      }
    });
  };

  // 输入框提示
  tipsIcon = title => (
    <Tooltip title={title}>
      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
    </Tooltip>
  );

  render() {
    const {
      editModalVisible,
      handleEditModalVisible,
      editFormValues,
      form: { getFieldDecorator },
    } = this.props;
    const option = { 1: '启用', 0: '停用' };
    return (
      <div>
        {editModalVisible ? (
          <Modal
            width={700}
            bodyStyle={{ padding: 'auto' }}
            destroyOnClose
            title={editFormValues.paraname ? '编辑信息' : '添加参数'}
            visible={editModalVisible}
            onOk={this.handleSubmit}
            onCancel={() => handleEditModalVisible(false, '')}
          >
            <Form {...formItemLayout}>
              {
                editFormValues.paraname ?
                  <Form.Item label="参数名称">
                    {getFieldDecorator('paraname', {
                      initialValue: editFormValues.paraname,
                    })(<Input readOnly suffix={this.tipsIcon('不可修改')} />)}
                  </Form.Item> :
                  <Form.Item label="参数名称">
                    {getFieldDecorator('paraname', {
                      rules: [
                        {
                          required: true,
                          message: '参数名称不能为空',
                        },
                      ],
                    })(<Input placeholder="请输入参数名称" />)}
                  </Form.Item>
              }

              <Form.Item label="参数描述">
                {getFieldDecorator('paradesc', {
                  initialValue: editFormValues.paradesc,
                })(<TextArea autosize={{ minRows: 2, maxRows: 3 }} />)}
              </Form.Item>

              <Form.Item label="参数值">
                {getFieldDecorator('paravalue', {
                  initialValue: editFormValues.paravalue,
                  rules: [
                    {
                      required: true,
                      message: '参数值不能为空',
                    },
                  ],
                })(<Input placeholder="请输入参数值" />)}
              </Form.Item>

              <Form.Item label="参数值描述">
                {getFieldDecorator('valuedesc', {
                  initialValue: editFormValues.valuedesc,
                })(<TextArea autosize={{ minRows: 2, maxRows: 3 }} />)}
              </Form.Item>

              <Form.Item label="参数状态">
                {getFieldDecorator('status', {
                  initialValue: editFormValues.status ? editFormValues.status : '1',
                })(
                  <Select placeholder="请选择">
                    {Object.keys(option).map(key => (
                      <Option value={key} key={key}>
                        {option[key]}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default EditParams;
