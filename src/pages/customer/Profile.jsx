import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Typography,
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Modal,
  App as AntApp,
  Space,
  Form,
  Input,
  Divider,
  Upload,
  Image,
  message,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  LockOutlined,
  VerifiedOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// IMPORT CLOUDINARY & MOCK DATA
import CloudinaryUpload from "../../components/common/CloudinaryUpload";
import { MOCK_USERS } from "../../constants/mockData.jsx";
import { useCookies } from "react-cookie";
import { AccountApiClient } from "../../services/apiClient.jsx";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const [cookies, _, removeCookie] = useCookies(["user"]);
  const [user,setUser] = useState();
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });


  const navigate = useNavigate();
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [formUpdate] = Form.useForm();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem("user")) ||
      MOCK_USERS.find((u) => u.id === 3),
  );

  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  // State lưu trữ URL từ Cloudinary
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

  useEffect(() => {
    if (!cookies.user) {
      navigate("/login");
    };

    const fetchApi = async () => {
      const myProfile = await AccountApiClient.myAccount(cookies.user._id);
      console.log(myProfile)
      if(myProfile.status >= 400){
        setLoading(true);
        return antdMessage.error(myProfile.message);
      }
      setLoading(false);
      setUser(myProfile.account);
    }
    fetchApi();
  }, [cookies.user, navigate, antdMessage,loading]);

  const handleFileChange = ({ file }) => {
    if (file.status === "removed") {
      setPreviewImage("");
      setUploadedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setUploadedFile(file);
      // Khi chọn file local, tạm thời xóa link Cloudinary để ưu tiên ảnh local nếu cần
      setCloudinaryUrl("");
    };
    reader.readAsDataURL(file.originFileObj);
  };

  const handleUpdateProfile = (values) => {
    setLoading(true);
    setTimeout(() => {
      // Ưu tiên: 1. Link Cloudinary mới -> 2. Ảnh local (base64) -> 3. Ảnh cũ
      const finalAvatar = cloudinaryUrl || previewImage || userData.avatar;

      const newData = {
        ...userData,
        ...values,
        avatar: finalAvatar,
      };
      setUserData(newData);
      sessionStorage.setItem("user", JSON.stringify(newData));
      antdMessage.success("Cập nhật thông tin thành công!");
      setIsUpdateModalOpen(false);
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    antdModal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có muốn thoát khỏi tài khoản không?",
      okText: "Đăng xuất",
      okType: "danger",
      onOk: () => {
        removeCookie("user");
        navigate("/");
      },
    });
  };

  const handleChangePassword = async() => {
    if(!password.current_password || password.current_password === ""){
      return antdMessage.error("Hãy nhập mật khẩu hiện tại");
    }
    if(password.new_password !== password.confirm_password){
      return antdMessage.error("Mật khẩu xác nhận chưa khớp");
    }
    const response = await AccountApiClient.changePassword(user._id,password);
    antdMessage.success(response.message);
    setIsPasswordModalOpen(false);
    
  }

  const renderUserInfo = () => (
    <Card bordered={false} style={{ borderRadius: borderRadiusLG }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <UserOutlined /> Thông tin cá nhân
        </Title>
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => {
              formUpdate.setFieldsValue(userData);
              setPreviewImage(userData.avatar);
              setCloudinaryUrl(userData.avatar);
              setUploadedFile(null);
              setIsUpdateModalOpen(true);
            }}
          >
            Sửa hồ sơ
          </Button>
          <Button
            icon={<LockOutlined />}
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Đổi mật khẩu
          </Button>
        </Space>
      </div>
      <Divider />
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={8} style={{ textAlign: "center" }}>
          <Avatar
            size={140}
            src={user.avartar}
            icon={<UserOutlined />}
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          />
          <Title level={3} style={{ marginTop: 16 }}>
            {user.full_name}
          </Title>
          <Space>
            <Tag color="blue">{user.role}</Tag>
            <Tag color="green" icon={<VerifiedOutlined />}>
              {user.status === "active" ? "Đang hoạt động" : ""}
            </Tag>
          </Space>
        </Col>
        <Col xs={24} md={16}>
          <Descriptions
            column={1}
            bordered
            labelStyle={{ fontWeight: "bold", width: "140px" }}
          >
            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Điện thoại">
              {user.phone || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tham gia">
              {`${new Date(user.createdAt).getDate()}-${new Date(user.createdAt).getMonth()}-${new Date(user.createdAt).getFullYear()}`}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {user.address ? user.address : "Không có"}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  return (
    (!loading || user) && (
      <>
        <Layout
          style={{
            minHeight: "85vh",
            background: "#f5f5f5",
            borderRadius: borderRadiusLG,
            overflow: "hidden",
          }}
        >
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme="light"
            width={220}
            style={{ borderRight: "1px solid #f0f0f0" }}
          >
            <div style={{ padding: "24px 16px", textAlign: "center" }}>
              {!collapsed && (
                <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                  TÀI KHOẢN
                </Text>
              )}
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["info"]}
              onClick={({ key }) => key === "logout" && handleLogout()}
              items={[
                {
                  key: "info",
                  icon: <UserOutlined />,
                  label: "Thông tin cá nhân",
                },
                { type: "divider" },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Đăng xuất",
                  danger: true,
                },
              ]}
            />
          </Sider>

          <Layout>
            <Header
              style={{
                background: colorBgContainer,
                padding: 0,
                display: "flex",
                alignItems: "center",
                height: 64,
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ width: 64, height: 64 }}
              />
            </Header>

            <Content style={{ margin: "20px", minHeight: 280 }}>
              {renderUserInfo()}
            </Content>
          </Layout>

          <Modal
            title="Cập nhật hồ sơ"
            open={isUpdateModalOpen}
            onCancel={() => setIsUpdateModalOpen(false)}
            onOk={() => formUpdate.submit()}
            confirmLoading={loading}
            okText="Lưu lại"
            cancelText="Hủy"
          >
            <Form
              form={formUpdate}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input size="large" />
              </Form.Item>

              <Form.Item label="Ảnh đại diện">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {/* Tích hợp Cloudinary */}
                  <CloudinaryUpload
                    onUploadSuccess={(url) => {
                      setCloudinaryUrl(url);
                      setPreviewImage(url);
                    }}
                  />

                  <Divider plain>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Hoặc dùng file máy tính
                    </Text>
                  </Divider>

                  <Upload
                    maxCount={1}
                    beforeUpload={() => false}
                    showUploadList={false}
                    onChange={handleFileChange}
                  >
                    <Button icon={<UploadOutlined />}>
                      Chọn file từ máy tính
                    </Button>
                  </Upload>
                </Space>

                {uploadedFile && !cloudinaryUrl && (
                  <div style={{ marginTop: 8 }}>
                    <PaperClipOutlined style={{ color: "#1890ff" }} />
                    <Text
                      type="secondary"
                      style={{ marginLeft: 8, color: "#1890ff" }}
                    >
                      {uploadedFile.name}
                    </Text>
                  </div>
                )}

                {previewImage && (
                  <div style={{ marginTop: 16 }}>
                    <Text
                      type="secondary"
                      style={{ display: "block", marginBottom: 8 }}
                    >
                      Xem trước:
                    </Text>
                    <Image
                      src={previewImage}
                      width={100}
                      height={100}
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #f0f0f0",
                      }}
                    />
                  </div>
                )}
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Đổi mật khẩu"
            open={isPasswordModalOpen}
            onCancel={() => setIsPasswordModalOpen(false)}
            onOk={handleChangePassword}
          >
            <Form layout="vertical">
              <Form.Item label="Mật khẩu hiện tại" required onChange={e => {
                setPassword({
                  ...password,
                  current_password: e.target.value
                })
                
              }}>
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="Mật khẩu mới" required onChange={e => {
                setPassword({
                  ...password,
                  new_password: e.target.value
                })
                
              }}>
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="Xác nhận mật khẩu mới" required onChange={e => {
                setPassword({
                  ...password,
                  confirm_password: e.target.value
                })
                
              }}>
                <Input.Password size="large" />
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      </>
    )
  );
};

export default Profile;
