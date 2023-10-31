import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { USERID } from "../../../constants";
import request from "../../../api";
import Loading from "../../../components/loading/Loading";
import './message.css'
const Message = () => {
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getMessage();
  }, [userId]);

  async function getMessage() {
    const userId = Cookies.get(USERID);
    if (userId !== undefined) {
      setUserId(userId);
    }
    setLoading(true);
    try {
      const {
        data: { pagination, data },
      } = await request.get(`messages`, {
        params: {
          whom: userId || '6539d12bb270150018e7fd84'
        },
      });
      setTotal(pagination.total);
      setMessage(data);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id) {
    if (message.info("Really Man🧐 Do you want delete")) {
      await request.delete(`messages/${id}`);
      getMessage();
    }
  }
  
  return (
    <Fragment>
        <div className="container1">
      {loading ? (
        <Loading />
      ) : (
        <main>
          <div className="table-data">
            <div className="order">
              <div className="msg__header">
                <h3 className="msgheading">Message ({total})</h3>
              </div>
              <div className="wrapeper_msg">
                  <ul className="ul__msg-main">
                    <li className="ul__li-msg">
                        <div className="li__div-msg">Messaage</div>
                        <div className="li__div-msg">Title</div>
                        <div className="li__div-msg">Whom</div>
                        <div className="li__div-msg">Number</div>
                        <div className="li__div-msg">Action</div>
                    </li>
                  </ul>
                <ul className="ul__msg">
                  {message?.map((el) => (
                    <li key={el._id}>
                      <div className="li__div-msg">
                        <span className="status completed">
                          <h3>{el.message}</h3>
                        </span>
                      </div>
                      <div>
                        <span className="status completed">{el.title}</span>
                      </div>
                      <div>
                        {el?.whom?.firstName} {el?.whom?.lastName}
                      </div>
                      <div>{el?.user}</div>
                      <div>
                        {/* <button
                          // onClick={() => editEducation(edu?._id)}
                          className="crud__div__edit"
                        >
                          <i className="bx bxs-edit-alt"></i>
                        </button> */}
                        <button
                          onClick={() => deleteMessage(el?._id)}
                          className="crud__div__delete"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      )}
        </div>
    </Fragment>
  );
};

export default Message;
