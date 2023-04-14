import React from 'react';
import { Layout, Button, Input, Form, Row, Col, Card } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as Logo } from './assets/twilio-mark-red.svg';

const { Content } = Layout;

const LoginPage = ({onSubmit}) => {
    const [form] = Form.useForm();

    const handleSubmit = e => {
        e.preventDefault();

        form.validateFields()
            .then(values => {
                const { username } = values;
                onSubmit(username);
            })
            .catch(err => {
                // Handle form validation errors
            });
    };

    return (
        <Layout>
            <Content style={{ height: '100vh' }}>
                <Row type="flex" justify="space-around" align="middle" style={{ height: '100%' }}>
                    <Col span={12} offset={6}>
                        <Card style={{ maxWidth: '404px' }}>
                            <Row type="flex" justify="center" align="middle" style={{ marginBottom: '30px' }}>
                                <Logo />
                            </Row>

                            <Form form={form} onFinish={handleSubmit}>
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                                </Form.Item>
                                <Form.Item>
                                    <Button onSubmit={handleSubmit} block type="primary" htmlType="submit">
                                        Sign in
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginPage;