import { Link } from "react-router-dom";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";

import { login } from "../../../services/AuthController";

const Login = () => {
	const [messageApi, contextHolder] = message.useMessage();
	const success = () => {
		messageApi.open({
			type: "success",
			content: "Login success!",
		});
	};
	const error = () => {
		messageApi.open({
			type: "error",
			content: "Login failed!",
		});
	};
	const navigate = useNavigate();
	const loginFunction = async (values) => {
		console.log(values);
		login(values.email, values.password)
			.then((value) => {
				if (value !== null) {
					success();
					return navigate("/shop");
				}
			})
			.catch(() => {
				error();
				return navigate("/auth/login");
			});
	};

	return (
		<div className="wrapper">
			<h3>Welcome to my shop</h3>
			{contextHolder}
			<Form
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				style={{
					maxWidth: 600,
				}}
				initialValues={{
					remember: true,
				}}
				autoComplete="off"
				onFinish={loginFunction}>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your email!",
						},
					]}>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}>
					<Input.Password />
				</Form.Item>

				<Form.Item
					name="remember"
					valuePropName="checked"
					wrapperCol={{
						offset: 2,
						span: 16,
					}}>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<div className="button--wrapper">
					<Button
						type="primary"
						htmlType="submit"
						shape="round"
						block>
						Login
					</Button>

					<Link to={"/auth/register"} width="100%">
						<Button htmlType="button" shape="round" block>
							Register
						</Button>
					</Link>
				</div>
				<div className="button--back">
					<Link to={"/shop"} width="100%">
						<Button htmlType="button" shape="round" block>
							Back to shopping
						</Button>
					</Link>
				</div>
			</Form>
		</div>
	);
};

export default Login;
