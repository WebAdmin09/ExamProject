import { useEffect } from "react";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
    addSkill,
    deleteSkill,
    editSkill,
    getSkill,
    getSkills,
    manageModal,
    showModal,
    updateSkill,
} from "../../../redux/slices/skillSlice";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const SkillsPage = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { skills, isModalOpen, selected, loading, total } = useSelector(
        (state) => state.skill
    );

    useEffect(() => {
        dispatch(getSkills());
    }, [dispatch]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Percent",
            dataIndex: "percent",
            key: "percent",
        },
        {
            title: "Action",
            render: (_, row) => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            onClick={async () => {
                                await dispatch(getSkills())
                                await dispatch(editSkill(row._id))
                                let { payload } = await dispatch(getSkill(row._id))
                                form.setFieldsValue(payload)
                            }}
                        >
                            <EditOutlined />
                        </Button>
                        <Button
                            danger
                            type="primary"
                            onClick={async () => {
                                await dispatch(deleteSkill(row._id))
                                await dispatch(getSkills())
                            }
                            }
                        >
                            <DeleteOutlined />
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const Cancel = () => {
        dispatch(manageModal());
    };

    const handleOk = async () => {
        try {
            let values = await form.validateFields();
            if (selected === null) {
                await dispatch(addSkill(values));
            } else {
                await dispatch(updateSkill({ id: selected, values }));
            }
            Cancel();
            await dispatch(getSkills());
        } catch (error) {
            message.error('It is wrong action')
        }
    };

    return (
        <div>
            <Table
                loading={loading}
                bordered
                title={() => (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h1>Skills</h1>
                        <span className="spantotal">Total:({total})</span>
                        <Button onClick={() => dispatch(showModal(form))} type="primary">
                            <PlusOutlined />
                        </Button>
                    </div>
                )}
                columns={columns}
                dataSource={skills}
            />
            <Modal
                title="Skill data"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={Cancel}
                okText={selected ? "Save skill" : "Add skill"}
            >
                <Form
                    form={form}
                    name="Skill"
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
                        label="Skill Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "It must not be empty",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Percent"
                        name="percent"
                        rules={[
                            {
                                required: true,
                                message: "It must not be empty",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SkillsPage;
