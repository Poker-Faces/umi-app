import React, { PureComponent } from 'react';
import { Modal, Form, Input, Tooltip, Icon, message, Select } from 'antd';
import { editTarget } from '@/services/config';

const { Option } = Select;
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
class EditTarget extends PureComponent {
  state = {
    editFlag: false,
  };

  // 保存信息
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { editFlag } = this.state;
        if (editFlag) {
          if (values.upValue <= values.downValue) {
            message.error('阀值上限不能小于等于阀值下限');
            return;
          }
        } else if (values.upValue === undefined && values.downValue === undefined) {
          message.error('当指标为单一指标时，上限和下限必须填写一个');
          return;
        }
        this.editTarget(values);
      }
    });
  };

  /**
   * 保存信息
   */
  editTarget = payload => {
    const { handleEditModalVisible, editFormValues } = this.props;
    const param = payload;
    param.targetCode = editFormValues.targetCode;
    param.targetUnit = editFormValues.targetUnit;

    return editTarget(param).then(data => {
      if (data) {
        handleEditModalVisible(false, param); // 关闭dialog窗口
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

  // 设置门阀限制值
  setSelectStatus = e => {
    let editFlag = true;
    if (e === '1') {
      editFlag = false;
    }
    this.setState({ editFlag });
  };

  render() {
    const {
      editModalVisible,
      handleEditModalVisible,
      editFormValues,
      form: { getFieldDecorator },
    } = this.props;
    const option = { '1': '单一指标', '2': '上下限指标' };
    const { editFlag } = this.state;
    return (
      <div>
        {this.setSelectStatus(editFormValues.targetType)}
        {editModalVisible ? (
          <Modal
            width={700}
            bodyStyle={{ padding: 'auto' }}
            destroyOnClose
            title={editFormValues.targetCode ? '编辑信息' : ''}
            visible={editModalVisible}
            onOk={this.handleSubmit}
            onCancel={() => handleEditModalVisible(false, '')}
          >
            <Form {...formItemLayout}>
              {/* <Form.Item label={"指标编号"}> */}
              {/*  {getFieldDecorator("targetCode", { */}
              {/*    initialValue: editFormValues.targetCode, */}
              {/*  })( */}
              {/*    <Input readOnly={true} suffix={this.tipsIcon("不可修改")}/> */}
              {/*  )} */}
              {/* </Form.Item> */}

              <Form.Item label="指标名称">
                {getFieldDecorator('targetName', {
                  initialValue: editFormValues.targetName,
                })(<Input readOnly suffix={this.tipsIcon('不可修改')} />)}
              </Form.Item>

              {/* <Form.Item label={"指标单位"}> */}
              {/*  {getFieldDecorator("targetUnit", { */}
              {/*    initialValue: editFormValues.targetUnit, */}
              {/*  })( */}
              {/*    <Input readOnly={true} suffix={this.tipsIcon("不可修改")}/> */}
              {/*  )} */}
              {/* </Form.Item> */}

              <Form.Item label="指标类型">
                {getFieldDecorator('targetType', {
                  initialValue: editFormValues.targetType,
                })(
                  <Select placeholder="请选择" onChange={this.setSelectStatus}>
                    {Object.keys(option).map(key => (
                      <Option value={key} key={key}>
                        {option[key]}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="报警阀值上限">
                {getFieldDecorator('upValue', {
                  initialValue: editFormValues.upValue,
                  rules: [
                    {
                      required: editFlag,
                      message: '报警阀值上限不能为空',
                    },
                  ],
                })(
                  <Input
                    type="number"
                    placeholder="请输入报警阀值上限"
                    suffix={this.tipsIcon('仅支持整数')}
                  />
                )}
              </Form.Item>

              <Form.Item label="报警阀值下限">
                {getFieldDecorator('downValue', {
                  initialValue: editFormValues.downValue,
                  rules: [
                    {
                      required: editFlag,
                      message: '报警阀值下限不能为空',
                    },
                  ],
                })(
                  <Input
                    type="number"
                    placeholder="请输入报警阀值下限"
                    suffix={this.tipsIcon('仅支持整数')}
                  />
                )}
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default EditTarget;
