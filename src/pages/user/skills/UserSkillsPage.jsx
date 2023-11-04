import { useEffect, useState } from 'react';
import './userskills.css';
import deleteicon from '../../../assets/images/delete.svg';
import closeicon from '../../../assets/images/close.svg';
import editicon from '../../../assets/images/edit.svg';
import addbtn from '../../../assets/images/add.svg';
import Cookies from 'js-cookie';
import { LIMIT, USERID } from '../../../constants';
import request from '../../../api';
import { message } from 'antd';
import Loading from '../../../components/loading/Loading';
import { Input, Pagination } from 'antd';

const { Search } = Input;

const UserSkillsPage = () => {
  const [userID, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [skills, setSkills] = useState(null);
  const [select, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [things, setThings] = useState({
    name: '',
    percent: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  console.log(userID);

  useEffect(() => {
    getDataSkill();
  }, [search, currentPage, userID]);

  const getDataSkill = async (page = 1) => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      setUserId(userID);
    }
    setLoading(true);
    try {
      const { data } = await request.get('skills', {
        params: {
          search: search,
          limit: LIMIT,
          user: userID,
          page,
        },
      });
      console.log(data);
      setSkills(data.data);
      setTotal(data.pagination.total);
      setCurrentPage(page);
    } catch (error) {
      message.error('Maybe API is not working');
    } finally {
      setLoading(false);
    }
  };

  const showmodal = () => {
    setThings({
      name: '',
      percent: '',
    });
    setSelected(null);
    setIsModalOpen(true);
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setThings({
      ...things,
      [name]: value,
    });
  };

  const editSkill = async (id) => {
    setSelected(id);
    try {
      setIsModalOpen(true);
      const { data } = await request.get(`skills/${id}`);
      setThings({
        name: data.name,
        percent: data.percent,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (message.info('Really Man🧐 Do you want to delete')) {
      await request.delete(`skills/${id}`);
      getDataSkill();
    }
  };

  const handleokay = async (e) => {
    e.preventDefault();
    try {
      if (select === null) {
        await request.post('skills', things);
      } else {
        await request.put(`skills/${select}`, things);
      }
      getDataSkill();
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1); 
    getDataSkill();
  };
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container1 forskill">
          <div className="main__text">
            <h1 className="skillsname">Skills({total})</h1>
            <Search
             className="searchbtn"
             placeholder="Searching...."
             allowClear
             enterButton="Search"
             size="large"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             onSearch={handleSearch} 
             />
            <button className="addbtn" onClick={showmodal}>
              <img className="imgadd" src={addbtn} alt="casacasc" />
            </button>
          </div>
          <div className="tabs">
            <div className="tabs__item">
              <ul className="tabs__ul">
                <li className="tabs__ul-li">
                  <div className="tabs-li-div">Name</div>
                  <div className="tabs-li-div">Percent</div>
                  <div className="tabs-li-div">Action</div>
                </li>
              </ul>
              <ul className="ul__new">
                {skills?.map((el) => (
                  <li key={el._id} className="li__new">
                    <div className="li__new-dev">{el?.name}</div>
                    <div className="li__new-dev">{el?.percent}</div>
                    <div className="li__new-devs">
                      <button
                        className="btnicon"
                        onClick={() => deleteSkill(el?._id)}
                      >
                        <img className="icondelete" src={deleteicon} alt="cicaca" />
                      </button>
                      <button
                        className="btnicon"
                        onClick={() => editSkill(el?._id)}
                      >
                        <img className="icondelete" src={editicon} alt="cicaca" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pagination-container">
                <Pagination
                  current={currentPage}
                  total={total}
                  showSizeChanger={false}
                  onChange={(page) => getDataSkill(page)}
                />
              </div>
            </div>
          </div>
          <div className="modul" id={isModalOpen ? 'modalactive' : ''}>
            <form className="modal__form" onSubmit={handleokay}>
              <button
                className="imgclosebtn"
                onClick={() => setIsModalOpen(false)}
              >
                <img className="closeimg" src={closeicon} alt="cacacs" />
              </button>
              <span className="spanmodal">Add Skills</span>
              <input
                className="input"
                type="text"
                name="name"
                value={things.name}
                onChange={handlechange}
              />
              <input
                className="input"
                type="text"
                name="percent"
                value={things.percent}
                onChange={handlechange}
              />
              <button type="submit" className="modaladdbtn">
                {select ? 'Save' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSkillsPage;
