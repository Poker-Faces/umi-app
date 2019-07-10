import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Statistic,
  Table,
  Tooltip,
  Collapse,
} from 'antd';
import moment from 'moment';
import React, { Fragment, PureComponent } from 'react';
import {
  queryDeviceDetail,
  queryDevicelist,
  queryDetailInfo,
  getDeviceCount,
  getRealtimeData,
} from '@/services/device';
import styles from '@/components/TableList/TableList.less';

// const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;
const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};

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

const targetColumns = [
  // { title: "设备名称", dataIndex: "deviceName" },
  { title: '名称', dataIndex: 'targetName' },
  { title: '所属相', dataIndex: 'phase' },
  { title: '阀值下限', dataIndex: 'downValue' },
  { title: '阀值上限', dataIndex: 'upValue' },
  { title: '单位', dataIndex: 'targetUnit' },
  // { title: '指标描述', dataIndex: 'targetDesc' },
];

const realtimeColumns = [
  { title: '键', dataIndex: 'key' },
  { title: '值', dataIndex: 'val' },
];

const relayColumns = [
  { title: '序号', dataIndex: 'relayNum' },
  { title: '名称', dataIndex: 'relayName' },
  {
    title: '状态',
    dataIndex: 'relayStatus',
    render: text => {
      switch (text) {
        case '0':
          return '关闭';
        case '1':
          return '开启';
        default:
          return '';
      }
    },
  },
];

const lampColumns = [
  { title: '序号', dataIndex: 'orderNum' },
  { title: '名称', dataIndex: 'lampName' },
  {
    title: '状态',
    dataIndex: 'lampStatus',
    render: text => {
      switch (text) {
        case '0':
          return '关闭';
        case '1':
          return '开启';
        default:
          return '';
      }
    },
  },
];

@Form.create()
export default class Device extends PureComponent {
  state = {
    editModalVisible: false,
    editFormValues: { device: {}, groupList: [] },
    loading: true,
    data: [],
    pagination: {
      pageSize: 10,
      showQuickJumper: true,
      showSizeChanger: true,
    },
    deviceNum: 0,
    deviceValidSNum: 0,
    online: 0,
    detailVisible: false,
    detailData: {
      targetData: [],
      relayData: [],
      lampData: [],
    },
    message: { flag: false, deviceId: '' },
    payload: {},
    realtimeData: [], // 实时数据
    realtimeflag: false,
  };

  columns = [
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      render: text => {
        switch (text) {
          case '1':
            return '单相设备';
          case '2':
            return '三相设备';
          default:
            return '';
        }
      },
    },
    {
      title: '使用类型',
      dataIndex: 'deviceUseType',
      render: text => {
        switch (text) {
          case '1':
            return '主设备';
          case '2':
            return '从设备';
          default:
            return '';
        }
      },
    },
    { title: '设备名称', dataIndex: 'deviceName' },
    { title: '设备编号', dataIndex: 'deviceNo' },
    { title: '主设备名称', dataIndex: 'parentDeviceName' },
    { title: '设备相', dataIndex: 'phase' },
    {
      title: '设备状态',
      dataIndex: 'deviceStatus',
      render: text => {
        switch (text) {
          case '0':
            return '删除无效';
          case '1':
            return '已激活';
          case '2':
            return '未激活';
          default:
            return '';
        }
      },
    },
    {
      title: 'WiFi名称',
      dataIndex: 'deviceWorkWifiName',
    },
    {
      title: '用户手机号',
      dataIndex: 'userPhone',
    },
    {
      title: '所属分组',
      dataIndex: 'groupName',
    },
    {
      title: '配网时间',
      dataIndex: 'regTime',
      render: text => moment(text, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showDetailInfo(true, { deviceId: record.deviceId })}>详细信息</a>
          <Divider type="vertical" />
          <a onClick={() => this.showRealtimeData({ deviceNo: record.deviceNo })}>实时数据</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.queryDeviceList();
    this.getDeviceCount();
  }

  /**
   * 查询列表
   * @param payload 默认查询10条数据
   * @returns {Promise<void | never>}
   */
  queryDeviceList = (payload = { pageRow: 10 }) => {
    this.setState({ loading: true }); // 加载状态
    payload.token = "3Q09FuOrZJXnrgy1qdX";
    return queryDevicelist(payload).then(data => {
      if (data) {
        const { pagination } = { ...this.state };
        const { totalRow, currentPage, pageRow, gridModel } = data.data.deviceList;
        pagination.total = totalRow; // 总数
        pagination.current = currentPage;
        pagination.pageSize = pageRow;
        this.setState({
          data: gridModel, // list 数据
          loading: false, // 加载状态
          pagination, // 分页
          payload,
        });
      }
    });
  };

  /**
   * 查询实时监控数据
   * @param payload
   * @returns {*}
   */
  getRealtimeData = payload => {
    this.setState({ loading: true }); // 加载状态
    return getRealtimeData(payload).then(data => {
      if (data) {
        this.setState({
          realtimeData: data.data.realtimeData,
          loading: false, // 加载状态
          realtimeflag: true,
        });
      }
    });
  };

  /**
   * 查询设备总数
   * @returns {Promise<void | never>}
   */
  getDeviceCount = () =>
    getDeviceCount().then(data => {
      if (data) {
        this.setState({
          deviceNum: data.data.deviceNum,
          deviceValidSNum: data.data.deviceValidSNum,
          online: data.data.deviceOnline,
        });
        message.success('刷新成功');
      }
    });

  /**
   * 编辑 或者新增
   * @param flag
   * @param record
   */
  handleEditModalVisible = (flag, record) => {
    if (record.deviceId) {
      // 编辑时先请求数据
      queryDeviceDetail({ deviceId: record.deviceId })
        .then(data => {
          this.setState({
            editModalVisible: flag,
            editFormValues: data.data || {},
          });
        })
        .catch(err => {
          message.error(err);
        });
    } else {
      this.setState({
        editModalVisible: flag,
      });
    }
  };


  /**
   * 翻页
   * @param pagination
   */
  handleStandardTableChange = pagination => {
    const { pagination: pager, payload } = { ...this.state };
    pager.pageSize = pagination.pageSize;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const params = { ...payload };
    params.currentPage = pager.current;
    params.pageRow = pager.pageSize;
    this.queryDeviceList(params);
  };

  /**
   * 搜索列表
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { pagination: { pageSize } } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        pageRow: pageSize,
        ...fieldsValue,
      };
      this.queryDeviceList(values);
    });
  };

  /**
   * 重置
   * @param e
   */
  handleReset = e => {
    e.preventDefault(); // 必须包一层，否则浏览器会卡死
    this.queryDeviceList();
  };

  /**
   * 查看设备详细信息
   * @param flag
   * @param deviceId
   */
  showDetailInfo = (flag, deviceId) => {
    this.queryDetailInfo(flag, deviceId);
  };

  showRealtimeData = record => {
    this.getRealtimeData(record);
  };

  showSendMessage = (flag, deviceId) => {
    this.setState({ message: { flag, deviceId } });
  };

  Message = () => {
    const {
      message: { flag, deviceId },
    } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        width={700}
        bodyStyle={{ padding: 'auto' }}
        destroyOnClose
        title="发送消息"
        visible={flag}
        onCancel={() => this.showSendMessage(false, '')}
        afterClose={() => this.showSendMessage(false, '')}
        onOk={this.sendMessage}
      >
        <Form {...formItemLayout}>
          <Form.Item>
            {getFieldDecorator('deviceId', {
              initialValue: deviceId,
            })(<Input hidden />)}
          </Form.Item>
          <Form.Item label="消息内容">
            {getFieldDecorator('content')(<TextArea autosize={{ minRows: 5, maxRows: 6 }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  realtime = () => {
    const {
      realtimeData, loading, realtimeflag,
    } = this.state;
    return (
      <Modal
        width={700}
        bodyStyle={{ padding: 'auto' }}
        destroyOnClose
        title="实时数据"
        visible={realtimeflag}
        onCancel={() => this.setState({ realtimeflag: false })}
        afterClose={() => this.setState({ realtimeflag: false })}
      >
        <Table
          rowKey={record => `${record.key}${Math.random()} `}
          dataSource={realtimeData}
          pagination={false}
          columns={realtimeColumns}
          loading={loading}
        />
      </Modal>
    );
  };

  /**
   * 发送消息
   */
  sendMessage = () => {
    const { form } = this.props;
    const param = form.getFieldsValue();
    queryDetailInfo(param).then(data => {
      if (data) {
        message.success('发送成功');
      }
    });
  };

  /**
   * 查询列表
   * @param payload
   * @returns {Promise<void | never>}
   */
  queryDetailInfo = (flag, payload) =>
    queryDetailInfo(payload).then(data => {
      if (data) {
        const { targetList, relayList, lampList } = data.data;
        this.setState({
          detailVisible: flag,
          detailData: {
            targetData: targetList,
            relayData: relayList,
            lampData: lampList,
          },
        });
      }
    });

  /**
   * 设备详细信息
   * @returns {*}
   */
  renderTargetList = () => {
    const {
      detailData: { targetData, lampData, relayData },
      detailVisible,
    } = this.state;
    return (
      <Drawer
        title="设备详细信息"
        width="45%"
        placement="left"
        closable
        onClose={this.onClose}
        visible={detailVisible}
      >
        <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
          <Panel header="指标信息" key="1" style={customPanelStyle}>
            <Table
              rowKey={record => `${record.id}${Math.random()} `}
              dataSource={targetData}
              pagination={false}
              columns={targetColumns}
            />
          </Panel>
          <Panel header="继电器信息" key="2" style={customPanelStyle}>
            <Table
              rowKey={record => record.relayId}
              dataSource={relayData}
              pagination={false}
              columns={relayColumns}
            />
          </Panel>
          <Panel header="指示灯信息" key="3" style={customPanelStyle}>
            <Table
              rowKey={record => record.id}
              dataSource={lampData}
              pagination={false}
              columns={lampColumns}
            />
          </Panel>
        </Collapse>
        ,
      </Drawer>
    );
  };

  /**
   * 关闭 指标窗口
   */
  onClose = () => {
    this.setState({
      detailVisible: false,
      detailData: {
        targetData: [],
        relayData: [],
        lampData: [],
      },
    });
  };

  /**
   * 搜索栏 和 状态栏
   * @returns {*}
   */
  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { deviceNum, deviceValidSNum, online, payload } = { ...this.state };
    return (
      <Form layout="inline">
        <Row>
          <Col span={4}>
            <Statistic
              title={
                <span>
                  设备总数&nbsp;&nbsp;&nbsp;&nbsp;
                  <Tooltip autoAdjustOverflow placement="right" title="当前指定产品的设备总数">
                    <Icon type="question-circle" theme="filled" />
                  </Tooltip>
                </span>
              }
              value={deviceNum}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={
                <span>
                  激活设备&nbsp;&nbsp;&nbsp;&nbsp;
                  <Tooltip autoAdjustOverflow placement="right" title="当前已激活的设备总数">
                    <Icon type="question-circle" theme="filled" />
                  </Tooltip>
                </span>
              }
              value={deviceValidSNum}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={
                <span>
                  当前在线&nbsp;&nbsp;&nbsp;&nbsp;
                  <Tooltip autoAdjustOverflow placement="right" title="当前在线的设备总数">
                    <Icon type="question-circle" theme="filled" />
                  </Tooltip>
                </span>
              }
              value={online}
            />
          </Col>
          <Col span={5}>
            <Button onClick={this.reFreshHeader}>刷新</Button>
          </Col>
        </Row>
        <Divider />
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <Form.Item label="设备名称">
              {getFieldDecorator('deviceName', {
                initialValue: payload.deviceName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={24}>
            <Form.Item label="用户名">
              {getFieldDecorator('userName', {
                initialValue: payload.userName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={24}>
            <Form.Item label="用户手机号">
              {getFieldDecorator('phone', {
                initialValue: payload.phone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={4} sm={24}>
            <Form.Item label="分组名称">
              {getFieldDecorator('groupName', {
                initialValue: payload.groupName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button icon="search" type="primary" id="1" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} id="2" onClick={this.handleReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  /**
   * 刷新状态栏
   */
  reFreshHeader = () => {
    this.getDeviceCount();
  };

  render() {
    const { loading, data, pagination } = this.state;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              rowKey={record => record.deviceId}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <div>{this.renderTargetList()}</div>
        <div>{this.Message()}</div>
        <div>{this.realtime()}</div>
      </div>
    );
  }
}
