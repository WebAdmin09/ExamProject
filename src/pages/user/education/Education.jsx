import Search from "antd/es/input/Search"
import { Fragment, useEffect, useState } from "react"
import Loading from "../../../components/loading/Loading"
import deleteicon from '../../../assets/images/delete.svg'
import closeicon from '../../../assets/images/close.svg'
import editicon from '../../../assets/images/edit.svg'
import addbtn from '../../../assets/images/add.svg'
import Cookies from "js-cookie"
import request from "../../../api"
import { LIMIT, USERID } from "../../../constants"
import { message } from "antd"
import './education.css'

const EducationPage = () => {
    const [userID, setUserId] = useState('')
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0);
    const [educations, seteducations] = useState(null);
    const [select, setSelected] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [things, setthings] = useState({
      name: "",
      level: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    console.log(userID);
  
    useEffect(()=>{
      getDataeducation()
    }, [])
  
    const getDataeducation = async() =>{
      const userID = Cookies.get(USERID)
      if(userID !== undefined ){
        setUserId(userID)
      }
      setLoading(true);
      try {
        const {
          data: { pagination ,data  },
        } = await request.get(`education`, {
          params: {
            user: userID,
            search: search,
            limit: LIMIT,
          }
        })
        setTotal(pagination.total);
        seteducations(data);
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
        level: "",
        description: "",
        startDate: "",
        endDate: "",
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
  
    const editeducation = async(id) => {
      setSelected(id);
      try {
        setIsModalOpen(true);
        const { data } = await request.get(`education/${id}`);
        setthings({
          name: data.name,
          level: data.level,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      } finally {
        setLoading(false);
      }
    }
    const deleteeducation = async(id) => {
      if (message.info("Really Man🧐 Do you want delete")) {
        await request.delete(`education/${id}`);
        getDataeducation();
      }
    }
  
    const handleokay = async(e) => {
      e.preventDefault();
      try {
        if (select === null) {
          await request.post("education", things);
        } else {
          await request.put(`education/${select}`, things);
        }
        getDataeducation();
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
      <div className='container1 foreducation'>
        <div className='main__text'>
      <h1 className='educationsname'>Educations({total})</h1>
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
            <div className='tabs-li-div'>Level</div>
            <div className='tabs-li-div'>Description</div>
            <div className='tabs-li-div'>Start</div>
            <div className='tabs-li-div'>End</div>
            <div className='tabs-li-div'>Action</div>
            </li>
          </ul>
            <ul className='ul__new-edu'>
              {educations?.map((el)=>(
            <li key={el._id} className='li__new li__new-edu'>
              <div className='li__new-dev'>{el?.name}</div>
              <div className='li__new-dev'>{el?.level}</div>
              <div className='li__new-dev'>{el?.description}</div>
              <div className='li__new-dev'>{el?.startDate.split('T')[0]}</div>
              <div className='li__new-dev'>{el?.endDate.split('T')[0]}</div>
              <div className='li__new-devs'>
                <button className='btnicon'onClick={() => deleteeducation(el?._id)}>
                <img className='icondelete' src={deleteicon} alt="cicaca" />
                </button>
                <button className='btnicon'
                onClick={() => editeducation(el?._id)}>
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
            <img className='closeimgedu' src={closeicon} alt="cacacs" />
          </button>
          <span className='spanmodal'>Add educations</span>
          <input 
          className='input'
          type="text" 
          name="name" 
          value={things.name}
          onChange={handlechange}
          placeholder='name'
           />
          <input 
          className='input'
          type="text" 
          name="level" 
          value={things.level}
          placeholder='level'
          onChange={handlechange}
           />
          <input 
          className='input'
          type="text" 
          name="description" 
          value={things.description}
          onChange={handlechange}
          placeholder='description'
           />
          <input 
          className='inputdate'
          type="date" 
          name="startDate" 
          value={things.startDate}
          onChange={handlechange}
           />
          <input 
          className='inputdate'
          type="date" 
          name="endDate" 
          value={things.endDate}
          onChange={handlechange}
           />
           <button type='submit' className='modaladdbtn'>
            {select ? 'Save' : 'Add'}
           </button>
        </form>
      </div>  
    </div>   
    )}
    
    </Fragment>
  )
}

export default EducationPage