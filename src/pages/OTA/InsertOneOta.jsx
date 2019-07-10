import React, { PureComponent } from 'react';
import { Modal, Form, Input, Tooltip, Icon, message, Select, Button, Upload } from 'antd';
import debounce from 'lodash/debounce';
import reqwest from 'reqwest';

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
class InsertOneOta extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    this.state = {
      fileList: [],
    };
  }

  // 保存信息
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { fileList } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (fileList.length <= 0) {
          message.error('请上传固件');
          return;
        }
        const { handleEditModalVisible } = this.props;
        handleEditModalVisible(false, values); // 关闭dialog窗口

        console.log('Received values of form: ', values);
        const formData = new FormData();
        formData.append('file', fileList[0]);
        formData.append('data', JSON.stringify(values));
        this.setState({});
        // You can use any AJAX library you like
        reqwest({
          url: '//jsonplaceholder.typicode.com/posts/',
          method: 'post',
          processData: false,
          data: formData,
          success: () => {
            this.setState({
              fileList: [],
            });
            message.success('新增成功');
          },
          error: () => {
            this.setState({});
            message.error('新增失败');
          },
        });
      }
    });
  };

  // 输入框提示
  tipsIcon = title => (
    <Tooltip title={title}>
      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
    </Tooltip>
  );

  // 检索
  fetchUser = value => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(() => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
        }
      });
  };

  render() {
    const {
      editModalVisible,
      handleEditModalVisible,
      editFormValues,
      form: { getFieldDecorator },
    } = this.props;
    const { fileList } = this.state;

    // 文件上传
    const props = {
      name: '上传固件',
      accept: '.bin,.tar,.gz,.zip',
      multiple: false,
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      onChange: file => {
        // 保证只上传一个文件
        this.setState({
          fileList: [file.file],
        });
      },
      fileList,
    };
    const option = { MD5: 'MD5', SHA256: 'SHA256' };
    return (
      <div>
        {editModalVisible ? (
          <Modal
            width={700}
            bodyStyle={{ padding: 'auto' }}
            destroyOnClose
            title={editFormValues.key ? '编辑固件' : '添加固件'}
            visible={editModalVisible}
            onOk={this.handleSubmit}
            onCancel={() => handleEditModalVisible(false, '')}
          >
            <Form {...formItemLayout}>
              <Form.Item label="固件名称">
                {getFieldDecorator('gujianmc', {
                  initialValue: editFormValues.key,
                  rules: [
                    {
                      required: true,
                      message: '固件名称不能为空',
                      // pattern
                    },
                    {
                      len: 32,
                      min: 4,
                      max: 32,
                      whitespace: false,
                      message: '固件名称格式错误',
                    },
                  ],
                })(
                  <Input
                    placeholder="请输入您的固件名称"
                    suffix={this.tipsIcon(
                      '支持中文、英文字母、数字和下划线，长度限制4~32，不能以下划线开头'
                    )}
                  />
                )}
              </Form.Item>
              <Form.Item label="固件版本号">
                {getFieldDecorator('gujianbbh', {
                  initialValue: editFormValues.key,
                  rules: [
                    {
                      required: true,
                      message: '请输入您的固件版本号',
                    },
                  ],
                })(
                  <Input
                    placeholder="版本名称需与实际固件版本保持一致"
                    suffix={this.tipsIcon('仅支持英文字母、数字、点、中划线和下划线，长度限制1~64')}
                  />
                )}
              </Form.Item>
              <Form.Item label="签名算法">
                {getFieldDecorator('qianmingsf', {
                  initialValue: 'MD5',
                  rules: [
                    {
                      required: true,
                      message: '请选择签名算法',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.keys(option).map(key => (
                      <Option value={key} key={key}>
                        {option[key]}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="选择固件">
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" />
                    上传固件
                  </Button>
                  &nbsp;&nbsp;&nbsp;{this.tipsIcon('仅支持bin,tar,gz,zip类型的文件')}
                </Upload>
              </Form.Item>

              <Form.Item label="固件描述">
                {getFieldDecorator('gujianms')(
                  <TextArea
                    placeholder="请简要描述应用的功能"
                    autosize={{ minRows: 2, maxRows: 6 }}
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

export default InsertOneOta;
