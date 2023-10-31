import { Fragment, useEffect, useState } from 'react';
import { Table, Button, Input, Modal, message, Pagination } from 'antd'; // Ant Design komponentlarini chaqiring
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons'; // Ant Design ikonalarini chaqiring
import Cookies from 'js-cookie';
import request from '../../../api';
import { LIMIT, USERID } from '../../../constants';
import Loading from '../../../components/loading/Loading';
import './education.css';

const { Search } = Input;

const EducationPage = () => {
  const [userID, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [educations, setEducations] = useState(null);
  const [select, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [things, setThings] = useState({
    name: '',
    level: '',
    description: '',
    startDate: '',
    endDate: '',
  });
console.log(userID);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: LIMIT,
    total: 0,
  });

  const fetchData = async () => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      setUserId(userID);
    }
    setLoading(true);
    try {
      const { data } = await request.get('education', {
        params: {
          user: userID,
          search: search,
          limit: pagination.pageSize,
          page: pagination.current,
        },
      });
      setTotal(data.pagination.total);
      setEducations(data.data);
    } catch (error) {
      message.error('Maybe API is not working');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, pagination.current, pagination.pageSize]);

  const showModal = () => {
    setThings({
      name: '',
      level: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      if (select === null) {
        await request.post('education', things);
      } else {
        await request.put(`education/${select}`, things);
      }
      fetchData();
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Level',
      dataIndex: 'level',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Start',
      dataIndex: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'End',
      dataIndex: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <span>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteEducation(record.id)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => editEducation(record.id)}
          />
        </span>
      ),
    },
  ];

  const data = educations?.map((edu) => ({
    key: edu._id,
    id: edu._id,
    name: edu.name,
    level: edu.level,
    description: edu.description,
    startDate: edu.startDate,
    endDate: edu.endDate,
  }));

  const handleTableChange = (current, pageSize) => {
    setPagination({ ...pagination, current, pageSize });
  };

  const deleteEducation = async (id) => {
    if (message.info('Really? Do you want to delete this item?')) {
      await request.delete(`education/${id}`);
      fetchData();
    }
  };

  const editEducation = async (id) => {
    setSelected(id);
    try {
      setIsModalOpen(true);
      const { data } = await request.get(`education/${id}`);
      setThings({
        name: data.name,
        level: data.level,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className='container1 foreducation'>
          <div className='main__text'>
            <h1 className='educationsname'>Educations ({total})</h1>
            <Search
              className='searchbtn'
              placeholder='Search....'
              allowClear
              enterButton={
                <SearchOutlined style={{ fontSize: '16px' }} />
              }
              size='large'
              onChange={(e) => setSearch(e.target.value)}
              onSearch={fetchData}
            />
            <Button
              className='addbtn'
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add
            </Button>
          </div>
          <div className='tabs'>
            <div className='tabs__item'>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
              />
              <Pagination
                style={{ marginTop: '16px' }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={total}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                onChange={handleTableChange}
              />
            </div>
          </div>
          <Modal
            title='Add education'
            visible={isModalOpen}
            onOk={handleModalOk}
            onCancel={() => setIsModalOpen(false)}
          >
            <form className='modal__form' onSubmit={handleModalOk}>
              <Button
                className='imgclosebtn'
                onClick={() => setIsModalOpen(false)}
              >
                <CloseOutlined style={{ fontSize: '16px' }} />
              </Button>
              <span className='spanmodal'>Add education</span>
              <input
                className='input'
                type='text'
                name='name'
                value={things.name}
                onChange={(e) => setThings({ ...things, name: e.target.value })}
                placeholder='Name'
              />
              <input
                className='input'
                type='text'
                name='level'
                value={things.level}
                onChange={(e) => setThings({ ...things, level: e.target.value })}
                placeholder='Level'
              />
              <input
                className='input'
                type='text'
                name='description'
                value={things.description}
                onChange={(e) =>
                  setThings({ ...things, description: e.target.value })
                }
                placeholder='Description'
              />
              <input
                className='inputdate'
                type='date'
                name='startDate'
                value={things.startDate}
                onChange={(e) =>
                  setThings({ ...things, startDate: e.target.value })
                }
              />
              <input
                className='inputdate'
                type='date'
                name='endDate'
                value={things.endDate}
                onChange={(e) =>
                  setThings({ ...things, endDate: e.target.value })
                }
              />
              <Button type='submit' className='modaladdbtn'>
                {select ? 'Save' : 'Add'}
              </Button>
            </form>
          </Modal>
        </div>
      )}
    </Fragment>
  );
};

export default EducationPage;
