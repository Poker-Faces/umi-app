import React, { Component } from 'react';
import { Card, Table, Form } from 'antd';
import styles from './TableList.less';

@Form.create()
export default class TableTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
      },
      payload: {},
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    // 加载页面
    this.queryListFetch();
    // 方法传递给父组件
    const { onRef } = this.props;
    if (undefined !== onRef && onRef != null) {
      onRef(this);
    }
  }

  /**
   * 获取搜索参数
   * @returns {*}
   */
  getParams = () => (this.state.payload);

  /**
   * 查询列表
   * @param payload
   * @returns {Promise<void | never>}
   */
  queryListFetch = (payload = { pageRow: 10 }) => {
    this.setState({ loading: true }); // 加载状态
    const { queryList, listName } = this.props;
    return queryList(payload).then(data => {
      if (data) {
        const { pagination } = { ...this.state };
        const { totalRow, currentPage, pageRow, gridModel } = data.data[listName];
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
   * 搜索区域
   * @returns {*}
   */
  renderSimpleForm = () => {
    const { form, renderSimpleForm, handleEditModalVisible } = this.props;
    return (
      <div>
        {renderSimpleForm(form, this.handleSearch, this.handleReset, handleEditModalVisible)}
      </div>
    );
  };

  /**
   * 搜索列表
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form, endDate, startDate } = this.props;
    const { pagination: { pageSize } } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        pageRow: pageSize,
        startDate,
        endDate,
      };
      this.queryListFetch(values);
    });
  };

  /**
   * 重置
   * @param e
   */
  handleReset = e => {
    e.preventDefault(); // 必须包一层，否则浏览器会卡死
    const { form } = this.props;
    form.resetFields();
    this.queryListFetch();
  };

  /**
   * 翻页
   * @param pagination
   * @param filters
   * @param sorter
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
    this.queryListFetch(params);
  };

  /**
   *d ata-row-key
   * @returns {*}
   */
  setRowKey = record => {
    for (const key of Object.keys(record)) {
      if (key.includes('id') || key.includes('Id')) {
        return record[key];
      }
    }
    return Math.random();
  };

  render() {
    const { pagination, loading, data } = this.state;
    const { columns } = this.props;
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              rowKey={this.setRowKey}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </div>
    );
  }
}
