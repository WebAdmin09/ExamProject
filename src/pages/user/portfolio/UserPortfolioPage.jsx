import { useState, useEffect } from 'react';
import { Pagination, Image, message } from 'antd';
import Search from 'antd/es/input/Search';
import Cookies from 'js-cookie';
import request from '../../../api';
import { LIMIT, USERID, ENDPOINT } from '../../../constants';
import './userportfolio.css';

const UserPortfolioPage = () => {
  const [userID, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [portfolios, setPortfolios] = useState(null);
  const [select, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [things, setThings] = useState({
    name: '',
    url: '',
    description: '',
    photo: '',
  });
  console.log(userID);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    getDataPortfolios(currentPage);
  }, [currentPage]);

  const getDataPortfolios = async (page) => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      setUserId(userID);
    }
    setLoading(true);
    try {
      const {
        data: { pagination, data },
      } = await request.get('portfolios', {
        params: {
          user: userID,
          search: search,
          limit: LIMIT,
          page: page,
        },
      });
      setTotal(pagination.total);
      setPortfolios(data);
    } catch (error) {
      message.error('Maybe API is not working');
    } finally {
      setLoading(false);
    }
  };

  const loadimage = async (e) => {
    try {
      const form = new FormData();
      if (e.target.files) {
        form.append('file', e.target.files[0]);
      }
      const { data } = await request.post('upload', form);
      setPhoto(data);
    } catch (error) {
      message.error('Image upload failed');
    }
  };

  const showmodal = () => {
    setThings({
      name: '',
      url: '',
      description: '',
      photo: '',
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
      const { data } = await request.get(`portfolios/${id}`);
      setThings({
        name: data.name,
        url: data.url,
        description: data.description,
        photo: data.photo,
      });
    } catch (error) {
      message.error('Error fetching portfolio data');
    }
  };

  const deleteSkill = async (id) => {
    if (window.confirm('Really? Do you want to delete this?')) {
      try {
        await request.delete(`portfolios/${id}`);
        getDataPortfolios(currentPage);
      } catch (error) {
        message.error('Error deleting portfolio');
      }
    }
  };

  const handleokay = async (e) => {
    e.preventDefault();
    const user = { ...things, photo: photo };
    try {
      if (select === null) {
        await request.post('portfolios', user);
      } else {
        await request.put(`portfolios/${select}`, user);
      }
      getDataPortfolios(currentPage);
    } catch (error) {
      message.error('Error saving portfolio');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="container1 forskill">
          <div className="main__text">
            <h1 className="skillsname">Portfolios ({total})</h1>
            <Search
              className="searchbtn"
              placeholder="Search..."
              allowClear
              enterButton="Search"
              size="large"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="addbtn" onClick={showmodal}>
              Add Portfolio
            </button>
          </div>
          <div className="tabs">
            <div className="tabs__item">
              <ul className="tabs__ul">
                <li className="tabs__ul-li">
                  <div className="tabs-li-div">Name</div>
                  <div className="tabs-li-div">Link</div>
                  <div className="tabs-li-div">Photo</div>
                  <div className="tabs-li-div">Actions</div>
                </li>
              </ul>
              <ul className="ul__new">
                {portfolios?.map((el) => (
                  <li key={el._id} className="li__new">
                    <div className="li__new-dev">{el?.name}</div>
                    <div className="li__new-dev">{el?.url}</div>
                    <div className="li__new-dev">
                      <Image
                        className="imgportfolio"
                        width={50}
                        src={`${ENDPOINT}upload/${el?.photo?._id}.${el?.photo?.name.split('.')[1]}`}
                        alt="Portfolio"
                      />
                    </div>
                    <div className="li__new-devs">
                      <button className="btnicon" onClick={() => deleteSkill(el?._id)}>
                        Delete
                      </button>
                      <button className="btnicon" onClick={() => editSkill(el?._id)}>
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={total}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
          <div className="modul" id={isModalOpen ? 'modalactive' : ''}>
            <form className="modal__form" onSubmit={handleokay}>
              <button className="imgclosebtn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
              <span className="spanmodal">Add Portfolio</span>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Name"
                value={things.name}
                onChange={handlechange}
              />
              <input
                placeholder="Link"
                className="input"
                type="url"
                name="url"
                value={things.url}
                onChange={handlechange}
              />
              <input
                className="input"
                placeholder="Description"
                value={things.description}
                name="description"
                type="text"
                onChange={handlechange}
              />
              <input
                className="inputimg"
                type="file"
                name="photo"
                onChange={(e) => loadimage(e)}
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

export default UserPortfolioPage;
