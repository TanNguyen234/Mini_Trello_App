import { Typography, Card, Col, Row, Input } from "antd"; // Import Input
import { Link } from "react-router-dom";
import "./style.scss";

const { Title } = Typography;

const BoardManagementPage = () => {
  // Dữ liệu giả định cho các board, khớp với cấu trúc API bạn đã cung cấp
  const boards = [
    {
      id: "board_id_1",
      name: "Board Name 1",
      description:
        "This is a detailed description for Board Name 1. It contains important project information and tasks to be completed.",
    },
    {
      id: "board_id_2",
      name: "Board Name 2",
      description:
        "Description for Board Name 2. This board focuses on marketing strategies.",
    },
    {
      id: "board_id_3",
      name: "Board Name 3",
      description:
        "Product development board. New features and bugs are tracked here.",
    },
    {
      id: "board_id_4",
      name: "Board Name 4",
      description:
        "Website redesign project board. UI/UX improvements and backend integration.",
    },
    {
      id: "board_id_5",
      name: "Board Name 5",
      description:
        "Another board with a very long description to test wrapping and auto-sizing capabilities of the textarea for boards that have extensive details about their purpose and ongoing activities.",
    },
    { id: "board_id_6", name: "Board Name 6", description: "" }, // Board without description
  ];

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

      <Row gutter={[6,6]}>
        {boards.length !== 0 ? (
          <>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Link to="/boards" className="board-card-link">
                <textarea> My Trello board</textarea>
              </Link>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Link to="/create-board" className="board-card-link">
                <textarea className="textarea_none"> + Create a new board</textarea>
              </Link>
            </Col>
          </>
        ) : (
          // Hiển thị danh sách các board khi có dữ liệu
          boards.map((board) => (
            <Col key={board.id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/board/${board.id}`} className="board-card-link">
                <Card className="board-card">
                  <Input.TextArea
                    value={board.name || "No description provided."}
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    readOnly
                    className="board-card-description-textarea"
                  />
                </Card>
              </Link>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default BoardManagementPage;
