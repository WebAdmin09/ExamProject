import { Fragment, useState } from "react";
import { Button, Form, Input, Modal, Pagination, Space, Table } from "antd";
import {
    useAddPortfolioMutation,
    useDeletePortfolioMutation,
    useGetPortfolioMutation,
    useGetPortfoliosQuery,
    useUpdatePortfolioMutation,
} from "../../../redux/services/PortfolioServices";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import './Portfolio.scss'

const PortfoliosPage = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    const { data, isFetching, refetch } = useGetPortfoliosQuery(page);

    const [getPortfolio] = useGetPortfolioMutation();
    const [addPortfolio] = useAddPortfolioMutation();
    const [updatePortfolio] = useUpdatePortfolioMutation();
    const [deletePortfolio] = useDeletePortfolioMutation();

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Url",
            dataIndex: "url",
            key: "url",
            render: (url) => (
                <a rel="noreferrer" target="_blank" href={url}>
                    {url}
                </a>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Action",
            render: (_, row) => {
                return (
                    <Space size="middle">
                        <Button type="primary" onClick={() => editPortfolio(row._id)}>
                            <EditOutlined />
                        </Button>
                        <Button
                            danger
                            type="primary"
                            onClick={async () => {
                                await deletePortfolio(row._id);
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
                await addPortfolio(values);
            } else {
                await updatePortfolio({ id: selected, body: values });
            }
            closeModal();
            refetch();
        } catch (err) {
            console.log(err);
        }
    };

    async function editPortfolio(id) {
        try {
            setSelected(id);
            setIsModalOpen(true);
            const { data } = await getPortfolio(id);
            form.setFieldsValue(data);
        } catch (err) {
            console.log(err);
        }
    }

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
                        <h1>Portfolios</h1>
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
                okText={selected ? "Save portfolio" : "Add portfolio"}
            >
                <Form
                    form={form}
                    name="portfolio"
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
                        label="Portfolio name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Don't forget Fill  !",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Portfolio url"
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: "Don't forget Fill !",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Don't forget Fill !",
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    );
};

export default PortfoliosPage;
