import { Typography, Card, Col, Row, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBoardsAPI } from "../../services/board";
import { Link } from "react-router-dom"; // Vẫn giữ Link nếu bạn muốn dùng cho My Trello Board
import "./style.scss";

const { Title } = Typography;

const BoardManagementPage = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoardsAPI(accessToken);
        setBoards(data);
      } catch (err) {
        console.error("Lỗi lấy danh sách boards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [accessToken]);

  return (
    <div className="board-management-page">
      <Title
        level={3}
        className="page-title"
        style={{
          fontWeight: "400",
          fontSize: "13px",
          lineHeight: "22px",
          letterSpacing: "0%",
          color: "#9095A1",
        }}
      >
        YOURWORKSPACE
      </Title>

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[6, 6]}>
          {/* 1. HIỂN THỊ "MY TRELLO BOARD" TRƯỚC */}
          <Col xs={24} sm={12} md={8} lg={6}>
            {/* Vẫn dùng Link tới /cards cho "My Trello Board" */}
            <Link to="/cards" className="board-card-link">
              <Card className="board-card">
                <Input.TextArea
                  value="My Trello Board"
                  autoSize={{ minRows: 2, maxRows: 3 }}
                  readOnly
                  className="board-card-description-textarea"
                />
              </Card>
            </Link>
          </Col>

          {/* 2. VÔ HIỆU HÓA CHỨC NĂNG "CREATE A NEW BOARD" */}
          <Col xs={24} sm={12} md={8} lg={6}>
            {/* Đã loại bỏ Link và thay bằng div để vô hiệu hóa chức năng */}
            <div className="board-card-link disabled-link"> {/* Thêm class disabled-link để tùy chỉnh CSS cho mờ đi nếu muốn */}
              <textarea className="textarea_none disabled-textarea">+ Create a new board</textarea>
            </div>
          </Col>

          {/* 3. HIỂN THỊ CÁC BOARD KHÁC (NẾU CÓ) */}
          {boards.map((board) => (
            <Col key={board.id} xs={24} sm={12} md={8} lg={6}>
              <Link to="/cards" className="board-card-link">
                <Card className="board-card">
                  <Input.TextArea
                    value={board.name || "No name"}
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    readOnly
                    className="board-card-description-textarea"
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BoardManagementPage;