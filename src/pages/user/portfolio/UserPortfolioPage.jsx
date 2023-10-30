import deleteicon from '../../../assets/images/delete.svg'
import closeicon from '../../../assets/images/close.svg'
import editicon from '../../../assets/images/edit.svg'
import addbtn from '../../../assets/images/add.svg'
import { Fragment, useState } from 'react'
import Cookies from 'js-cookie'
import { ENDPOINT, LIMIT, USERID } from '../../../constants'
import { useEffect } from 'react'
import request from '../../../api'
import { Image, message } from 'antd'
import Loading from '../../../components/loading/Loading'
import Search from 'antd/es/input/Search'
import './userportfolio.css'


const UserPortfolioPage = () => {

  const [userID, setUserId] = useState('')
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0);
  const [portfolios, setPortfolios] = useState(null);
  const [select, setSelected] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [things, setthings] = useState({
    name: "",
    url: "",
    description: "",
    photo: "",
  });
  console.log(userID);

  useEffect(()=>{
    getDataPortfolios()
  }, [])

  const getDataPortfolios = async() =>{
    const userID = Cookies.get(USERID)
    if(userID !== undefined ){
      setUserId(userID)
    }
    setLoading(true);
    try {
      const {
        data: { pagination ,data  },
      } = await request.get(`portfolios`, {
        params: {
          user: userID,
          search: search,
          limit: LIMIT,
        }
      })
      setTotal(pagination.total);
      setPortfolios(data);
    } catch (error) {
      message.error('Maybe Api is not work')
      setLoading(true)
    } finally {
      setLoading(false);
    }
  }

  async function loadimage(e) {
    try {
      const form = new FormData();
      if (e.target.files) {
        form.append("file", e.target.files[0]);
      }
      const { data } = await request.post("upload", form);
      setPhoto(data);
      console.log(photo);
    } finally {
      console.log("Image upload");
    }
  }
  const showmodal = () => {
    setthings({
      name: "",
      url: "",
      description: "",
      photo: "",
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
      const { data } = await request.get(`portfolios/${id}`);
      setthings({
        name: data.name,
        url: data.url,
        description: data.description,
        photo: data.photo,
      });
    } finally {
      setLoading(false);
    }
  }
  async function deleteSkill(id) {
    if (message.info("Really Man🧐 Do you want delete")) {
      await request.delete(`portfolios/${id}`);
      getDataPortfolios();
    }
  }

  async function handleokay(e) {
    e.preventDefault();
    const user = {...things, photo: photo}
    try {
      if (select === null) {
        await request.post("portfolios", user);
      } else {
        await request.put(`portfolios/${select}`, user);
      }
      getDataPortfolios();
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
      <h1 className='skillsname'>Portfolios({total})</h1>
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
            <div className='tabs-li-div'>Link</div>
            <div className='tabs-li-div'>Photo</div>
            <div className='tabs-li-div'>Actions</div>
            </li>
          </ul>
            <ul className='ul__new'>
              {portfolios?.map((el)=>(
            <li key={el._id} className='li__new'>
              <div className='li__new-dev'>{el?.name}</div>
              <div className='li__new-dev'>{el?.url}</div>
              <div className='li__new-dev'>
                {/* <img className='imgportfolio' src={`${ENDPOINT}upload/${el?.photo?._id}.${
                        el?.photo?.name.split(".")[1]
                      }`} alt="sd" /> */}
             <Image
             className='imgportfolio'
             width={50}
             src={`${ENDPOINT}upload/${el?.photo?._id}.${
              el?.photo?.name.split(".")[1]
            }`}
            alt="sd" 
             />
              </div>
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
            <img className='closeimgport' src={closeicon} alt="cacacs" />
          </button>
          <span className='spanmodal'>Add Portfolios</span>
          <input 
          className='input'
          type="text" 
          name="name" 
          placeholder='name'
          value={things.name} 
          onChange={handlechange}
           />
          <input 
          placeholder='url'
          className='input'
          type="url" 
          name="url" 
          value={things.url} 
          onChange={handlechange}
           />
               <input
               className='input'
               placeholder='description'
                value={things.description}
                name="description"
                type="text"
                onChange={handlechange}
              />
          <input 
          className='inputimg'
          type="file" 
          name="photo" 
          onChange={(e) => loadimage(e)}
          />
           <button type='submit' className='modaladdbtn'>{select ? 'Save' : 'Add'}</button>
        </form>
      </div>  
    </div>   
    )}
    
    </Fragment>
  )
}

export default UserPortfolioPage