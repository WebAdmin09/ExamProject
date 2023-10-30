import './userskills.css'
import deleteicon from '../../../assets/images/delete.svg'
import closeicon from '../../../assets/images/close.svg'
import editicon from '../../../assets/images/edit.svg'
import addbtn from '../../../assets/images/add.svg'
import { Fragment, useState } from 'react'
import Cookies from 'js-cookie'
import { LIMIT, USERID } from '../../../constants'
import { useEffect } from 'react'
import request from '../../../api'
import { message } from 'antd'
import Loading from '../../../components/loading/Loading'
import Search from 'antd/es/input/Search'
const UserSkillsPage = () => {

  const [userID, setUserId] = useState('')
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0);
  const [skills, setskills] = useState(null);
  const [select, setSelected] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [things, setthings] = useState({
    name: "",
    percent: "",
  });
  console.log(userID);

  useEffect(()=>{
    getDataSkill()
  }, [])

  const getDataSkill = async() =>{
    const userID = Cookies.get(USERID)
    if(userID !== undefined ){
      setUserId(userID)
    }
    setLoading(true);
    try {
      const {
        data: { pagination ,data  },
      } = await request.get(`skills`, {
        params: {
          user: userID,
          search: search,
          limit: LIMIT,
        }
      })
      setTotal(pagination.total);
      setskills(data);
    } catch (error) {
      message.error('Maybe Api is not work')
      setLoading(true)
    } finally {
      setLoading(false);
    }
  }

  const showmodal = () => {
    setthings({
      name: "",
      percent: "",
    });
    setSelected(null);
    setIsModalOpen(true);
  };
  const handlechange = (e) => {
    const { name, value } = e.target;
    setthings({
      ...things,
      [name]: value,
    });
  };

  async function editSkill(id) {
    setSelected(id);
    try {
      setIsModalOpen(true);
      const { data } = await request.get(`skills/${id}`);
      setthings({
        name: data.name,
        percent: data.percent,
      });
    } finally {
      setLoading(false);
    }
  }
  async function deleteSkill(id) {
    if (message.info("Really Man🧐 Do you want delete")) {
      await request.delete(`skills/${id}`);
      getDataSkill();
    }
  }

  async function handleokay(e) {
    e.preventDefault();
    try {
      if (select === null) {
        await request.post("skills", things);
      } else {
        await request.put(`skills/${select}`, things);
      }
      getDataSkill();
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  }
  return (
    <Fragment>
    {loading ? (
      <Loading />
    ) : (
      <div className='container1 forskill'>
        <div className='main__text'>
      <h1 className='skillsname'>Skills({total})</h1>
    <Search
    className='searchbtn'
      placeholder="searching...."
      allowClear
      enterButton="Search"
      size="large"
      onChange={(e) => setSearch(e.target.value)}
    />
      <button className='addbtn'
            onClick={showmodal}>
              <img className='imgadd' src={addbtn} alt="casacasc" />
      </button>
        </div>
      <div className='tabs'>
        <div className='tabs__item'>
          <ul className='tabs__ul'>
            <li className='tabs__ul-li'>
            <div className='tabs-li-div'>Name</div>
            <div className='tabs-li-div'>Percent</div>
            <div className='tabs-li-div'>Action</div>
            </li>
          </ul>
            <ul className='ul__new'>
              {skills?.map((el)=>(
            <li key={el._id} className='li__new'>
              <div className='li__new-dev'>{el?.name}</div>
              <div className='li__new-dev'>{el?.percent}</div>
              <div className='li__new-devs'>
                <button className='btnicon'onClick={() => deleteSkill(el?._id)}>
                <img className='icondelete' src={deleteicon} alt="cicaca" />
                </button>
                <button className='btnicon'
                onClick={() => editSkill(el?._id)}>
                <img className='icondelete' src={editicon} alt="cicaca" />
                </button>
              </div>
            </li>
              ))}
            </ul>
        </div>
      </div>
      <div className='modul' id={isModalOpen ? 'modalactive' : ''}>
        <form className='modal__form' onSubmit={handleokay}>
          <button className='imgclosebtn'
          onClick={() => setIsModalOpen(false)}
          >
            <img className='closeimg' src={closeicon} alt="cacacs" />
          </button>
          <span className='spanmodal'>Add Skills</span>
          <input 
          className='input'
          type="text" 
          name="name" 
          value={things.name}
          onChange={handlechange}
           />
          <input 
          className='input'
          type="text" 
          name="percent" 
          value={things.percent}
          onChange={handlechange}
           />
           <button type='submit' className='modaladdbtn'>{select ? 'Save' : 'Add'}</button>
        </form>
      </div>  
    </div>   
    )}
    
    </Fragment>
  )
}

export default UserSkillsPage