import { Typography, Card, Col, Row, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBoardsAPI } from "../../services/board";
import { Link } from "react-router-dom";
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
        console.log(data)
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/create-board" className="board-card-link">
              <textarea className="textarea_none">+ Create a new board</textarea>
            </Link>
          </Col>

          {boards.map((board) => (
            <Col key={board.id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/boards/${board.id}`} className="board-card-link">
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