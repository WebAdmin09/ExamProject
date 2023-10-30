import { Fragment, useEffect, useState } from "react"
import addbtn from '../../../assets/images/add.svg'
import deleteicon from '../../../assets/images/delete.svg'
import editicon from '../../../assets/images/edit.svg'
import closeicon from '../../../assets/images/close.svg'
import './experience.css'
import Cookies from "js-cookie"
import { LIMIT, USERID } from "../../../constants"
import request from "../../../api"
import { message } from "antd"
import Loading from "../../../components/loading/Loading"



const Experience = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userid, setUserId] = useState('')
    const [loading, setLoading] = useState(false);
    // const [search, setSearch] = useState('')
    const [exprience, setexprience] = useState(null);
    const [select, setSelected] = useState(null)
    const [total, setTotal] = useState(0);
    const [element, setElement] = useState({
        workName: "",
        companyName: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      console.log(userid);
      useEffect(()=>{
        getDataExprience()
      }, [])
    
      const getDataExprience = async() =>{
        const userid = Cookies.get(USERID)
        if(userid !== undefined){
            setUserId(userid)
        }
        setLoading(true)
        try {
            const {
                data: {pagination, data},
            } = await request.get(`experiences`, {
                params: {
                    user: userid,
                    // search: search,
                    limit: LIMIT,
                }
            })
            setTotal(pagination.total);
            setexprience(data)
        } catch (error) {
            message.error('Maybe Api is not work')
            setLoading(true)
        } finally {
            setLoading(false);
          }
      }

      const openModal = () => {
        setElement({
          workName: "",
          companyName: "",
          description: "",
          startDate: "",
          endDate: "",
        });
        setSelected(null);
        setIsModalOpen(true);
      };
      const handlechange = (e) => {
        const { name, value } = e.target;
        setElement({
          ...element,
          [name]: value,
        });
      };
      const handleOkay = async(e) =>{
        e.preventDefault();
        try {
          if (select === null) {
            await request.post("experiences", element);
          } else {
            await request.put(`experiences/${select}`, element);
          }
          getDataExprience()
        } catch (err){
          console.log(err);
        } 
         finally {
          setLoading(false);
          setIsModalOpen(false);
        }
      }
      const editExp = async(id) => {
        setSelected(id);
        try {
          setIsModalOpen(true);
          const { data } = await request.get(`experiences/${id}`);
          setElement({
            workName: data.workName,
            companyName: data.companyName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
          });
        } finally {
          setLoading(false);
        }
      }
      const deleteExp = async(id) => {
        if (message.info("Really Man🧐 Do you want delete")) {
          await request.delete(`experiences/${id}`);
          getDataExprience();
        }
      } 
  return (
    <Fragment>
        {loading ? (
            <Loading/>
        ): (
           <div className="container1">
        <div className="exp__header">
            <h1>Experience <span className="expspan">({total})</span></h1>
            <button className="exp__addbtn"
            onClick={openModal}
            >
                <img className="exp__addimg" src={addbtn} alt="dassvs" />
            </button>
        </div>
        <div className="exp__text-item">
            <ul className="exp__text-ul">
                <li className="exp__ul-li">
                    <div className="exp__li-div">WorkName</div>
                    <div className="exp__li-div">CompanyName</div>
                    <div className="exp__li-div">Description</div>
                    <div className="exp__li-div">Start</div>
                    <div className="exp__li-div">End</div>
                    <div className="exp__li-div">Action</div>
                </li>
            </ul>
            <ul className="expn__text-ul">
                {exprience?.map((el) => (
                <li key={el._id} className="expn__ul-li">
                    <div className="expn__li-div">{el?.workName}</div>
                    <div className="expn__li-div">{el?.companyName}</div>
                    <div className="expn__li-div">{el?.description}</div>
                    <div className="expn__li-div">{el?.startDate.split('T')[0]}</div>
                    <div className="expn__li-div">{el?.endDate.split('T')[0]}</div>
                    <div className="expn__li-div">
                        <button
                        className='btnicon'
                        onClick={() => deleteExp(el?._id)}
                        >
                        <img className='iconaction' src={deleteicon} alt="cicaca" />
                        </button>
                        <button 
                        className='btnicon'
                        onClick={() => editExp(el?._id)}
                           >
                           <img className='iconaction' src={editicon} alt="cicaca" />
                           </button>
                    </div>
                </li>
                ))}
            </ul>
        </div>
        <div className="modalexp" id={isModalOpen ? 'modalexprence' : ''}>
            <form 
            className="formexpr"
            onSubmit={handleOkay}
            >
              <button className='imgclosebtn'
               onClick={() => setIsModalOpen(false)}
              >
            <img className='closeimgexp' src={closeicon} alt="cacacs" />
            </button>
            <h5 className="headingexp">Add Experience</h5>
            <input 
            className="inputexp"
            placeholder="WorkName"
            type="text"
            name="workName"
            value={element.workName}
            onChange={handlechange}
            />
            <input 
            className="inputexp"
            placeholder="CompanyName"
            type="text"
            name="companyName"
            value={element.companyName}
            onChange={handlechange}
            />
            <input 
            className="inputexp"
            placeholder="Description"
            type="text"
            name="description"
            value={element.description}
            onChange={handlechange}
            />
             <input 
          className='inputdatexp'
          type="date" 
          name="startDate" 
          value={element.startDate}
          onChange={handlechange}
           />
          <input 
          className='inputdatexp'
          type="date" 
          name="endDate" 
          value={element.endDate}
          onChange={handlechange}
           />
          <button type='submit' className='modalbtnexp'>
            {select ? 'Save' : 'Add'}
           </button>
            </form>
        </div>
           </div>
        )}
    </Fragment>
  )
}

export default Experience