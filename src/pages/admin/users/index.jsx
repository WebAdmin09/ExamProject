import { DeleteOutlined, PlusOutlined, } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, Modal, Pagination, Select, Space, Table,} from "antd"
import { Option } from "antd/es/mentions";
import { Fragment, useState } from "react"
import { useAddUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "../../../redux/services/UsersServices";

const UsersPage = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    console.log(setSelected);
    const { data, isFetching, refetch } = useGetUsersQuery(page);

    // const [getUser] = useGetUserMutation();
    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const columns = [
        {
            title: "FirstName",
            dataIndex: "firstName",
            key: "firstname",
        },
        {
            title: "LastName",
            dataIndex: "lastName",
            key: "lastname",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "PhoneNumber",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
          },
        {
            title: "Birthday",
            dataIndex: "birthday",
            key: "birthday",
        },
        {
            title: "Action",
            render: (_, row) => {
                return (
                    <Space size="middle">
                        <Button
                            danger
                            type="primary"
                            onClick={async () => {
                                await deleteUser(row._id);
                                refetch();
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
        form.resetFields()
    };

    const handleOk = async () => {
        try {
            let values = await form.validateFields();
            values.photo = "6521485e1b06670014733226";
            if (selected === null) {
                await addUser(values);
            } else {
                await updateUser({ id: selected, body: values });
            }
            closeModal();
            refetch();
        } catch (err) {
            console.log(err);
        }
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
          <Select
            style={{
              width: 100,
            }}
          >
            <Option value="+998">+998</Option>
          </Select>
        </Form.Item>
      );
    return (
        <Fragment>
            <Table
                bordered
                loading={isFetching}
                title={() => (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h1>Users</h1>
                        <span className="spantotal">Total:({data?.pagination.total})</span>
                        <Button type="primary" onClick={openModal}>
                            <PlusOutlined />
                        </Button>
                    </div>
                )}
                columns={columns}
                dataSource={data?.data}
                scroll={{ x: 800 }}
                pagination={false}
            />
            <Pagination
                total={data?.pagination.total}
                current={page}
                onChange={(page) => setPage(page)}
            />
            <Modal
                title="Category data"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={closeModal}
                okText={selected ? "Save User" : "Add User"}
            >
                <Form
                    form={form}
                    name="User"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    autoComplete="off"
                >
                  <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="User Name"
            name="username"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input />
          </Form.Item>
                    <Form.Item
            label="Birthday"
            name="birthday"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <DatePicker />
          </Form.Item>
                    <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input />
          </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    )
}

export default UsersPage