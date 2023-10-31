import React from 'react';
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

class UserSkillsPage extends React.Component {
  state = {
    userID: '',
    loading: false,
    search: '',
    total: 0,
    skills: null,
    select: null,
    isModalOpen: false,
    things: {
      name: '',
      percent: '',
    },
    currentPage: 1, 
  };

  componentDidMount() {
    this.getDataSkill();
  }

  getDataSkill = async (page = 1) => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      this.setState({ userID });
    }
    this.setState({ loading: true });
    try {
      const { data } = await request.get('skills', {
        params: {
          user: userID,
          search: this.state.search,
          limit: LIMIT,
          page, 
        },
      });
      this.setState({
        skills: data.data,
        total: data.pagination.total,
        currentPage: page, 
      });
    } catch (error) {
      message.error('Maybe API is not working');
    } finally {
      this.setState({ loading: false });
    }
  };

  showmodal = () => {
    this.setState({
      things: {
        name: '',
        percent: '',
      },
      select: null,
      isModalOpen: true,
    });
  };

  handlechange = (e) => {
    const { name, value } = e.target;
    this.setState({
      things: {
        ...this.state.things,
        [name]: value,
      },
    });
  };

  editSkill = async (id) => {
    this.setState({ select: id });
    try {
      this.setState({ isModalOpen: true });
      const { data } = await request.get(`skills/${id}`);
      this.setState({
        things: {
          name: data.name,
          percent: data.percent,
        },
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  deleteSkill = async (id) => {
    if (message.info('Really Man🧐 Do you want to delete')) {
      await request.delete(`skills/${id}`);
      this.getDataSkill();
    }
  };

  handleokay = async (e) => {
    e.preventDefault();
    try {
      if (this.state.select === null) {
        await request.post('skills', this.state.things);
      } else {
        await request.put(`skills/${this.state.select}`, this.state.things);
      }
      this.getDataSkill();
    } finally {
      this.setState({ loading: false });
      this.setState({ isModalOpen: false });
    }
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <Loading />
        ) : (
          <div className="container1 forskill">
            <div className="main__text">
              <h1 className="skillsname">Skills({this.state.total})</h1>
              <Search
                className="searchbtn"
                placeholder="Searching...."
                allowClear
                enterButton="Search"
                size="large"
                onChange={(e) => this.setState({ search: e.target.value })}
                onSearch={() => this.getDataSkill()}
              />
              <button className="addbtn" onClick={this.showmodal}>
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
                  {this.state.skills?.map((el) => (
                    <li key={el._id} className="li__new">
                      <div className="li__new-dev">{el?.name}</div>
                      <div className="li__new-dev">{el?.percent}</div>
                      <div className="li__new-devs">
                        <button
                          className="btnicon"
                          onClick={() => this.deleteSkill(el?._id)}
                        >
                          <img className="icondelete" src={deleteicon} alt="cicaca" />
                        </button>
                        <button
                          className="btnicon"
                          onClick={() => this.editSkill(el?._id)}
                        >
                          <img className="icondelete" src={editicon} alt="cicaca" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pagination-container">
                  <Pagination
                    current={this.state.currentPage}
                    total={this.state.total}
                    showSizeChanger={false}
                    onChange={(page) => this.getDataSkill(page)}
                  />
                </div>
              </div>
            </div>
            <div className="modul" id={this.state.isModalOpen ? 'modalactive' : ''}>
              <form className="modal__form" onSubmit={this.handleokay}>
                <button
                  className="imgclosebtn"
                  onClick={() => this.setState({ isModalOpen: false })}
                >
                  <img className="closeimg" src={closeicon} alt="cacacs" />
                </button>
                <span className="spanmodal">Add Skills</span>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={this.state.things.name}
                  onChange={this.handlechange}
                />
                <input
                  className="input"
                  type="text"
                  name="percent"
                  value={this.state.things.percent}
                  onChange={this.handlechange}
                />
                <button type="submit" className="modaladdbtn">
                  {this.state.select ? 'Save' : 'Add'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserSkillsPage;
