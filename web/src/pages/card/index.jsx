import React, { useState } from "react";
import { Card, Input, Button, Modal, Typography } from "antd";
import { PlusOutlined, UserAddOutlined, CloseOutlined, CopyOutlined } from "@ant-design/icons"; // Import CloseOutlined và CopyOutlined
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.scss";

const ItemType = {
  TASK: "TASK",
};

const TaskCard = ({ task, index, moveTask, cardId }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.TASK,
    hover(draggedItem) {
      if (!ref.current) return;
      if (draggedItem.cardId === cardId && draggedItem.index !== index) {
        moveTask(cardId, draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { ...task, index, cardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="card">{task.title}</Card>
    </div>
  );
};

export default function CardBoardDnD() {
  const [cards, setCards] = useState([
    {
      id: "card_1",
      name: "To do",
      tasks: [
        { id: "task_1", title: "Project planning" },
        { id: "task_2", title: "Kickoff meeting" },
      ],
    },
    {
      id: "card_2",
      name: "Doing",
      tasks: [],
    },
    {
      id: "card_3",
      name: "Done",
      tasks: [{ id: "task_3", title: "Wrap up" }],
    },
  ]);

  const [newTaskText, setNewTaskText] = useState("");
  const [addingToList, setAddingToList] = useState(null);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

  const handleAddTask = (cardId) => {
    if (!newTaskText.trim()) return;
    const updated = cards.map((list) =>
      list.id === cardId
        ? {
            ...list,
            tasks: [
              ...list.tasks,
              { id: `task_${Date.now()}`, title: newTaskText },
            ],
          }
        : list
    );
    setCards(updated);
    setNewTaskText("");
    setAddingToList(null);
  };

  const moveTask = (cardId, fromIndex, toIndex) => {
    const updated = [...cards];
    const targetCard = updated.find((c) => c.id === cardId);
    if (!targetCard) return;
    const [moved] = targetCard.tasks.splice(fromIndex, 1);
    targetCard.tasks.splice(toIndex, 0, moved);
    setCards(updated);
  };

  const showInviteModal = () => {
    setIsInviteModalVisible(true);
  };

  const handleInviteModalClose = () => { // Đổi tên hàm để rõ ràng hơn là đóng modal
    setIsInviteModalVisible(false);
  };

  const handleCopyLink = () => {
    // Logic để copy link mời
    const inviteLink = "https://your-app.com/invite/abcdef123"; // Thay bằng link thật
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        console.log("Link mời đã được copy!");
        // Bạn có thể hiển thị một thông báo thành công ở đây (ví dụ: Ant Design Message)
      })
      .catch((err) => {
        console.error("Không thể copy link: ", err);
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board-view">
        <h2>
          <span>My Trello board</span>
          <span className="board-view__invite" onClick={showInviteModal}>
            <UserAddOutlined style={{ marginRight: '5px', color: '#9095A1' }} />
            Invite member 
          </span>
        </h2>
        <div className="lists-container">
          {cards.map((list) => (
            <div key={list.id} className="list">
              <h3>{list.name}</h3>
              <div className="cards">
                {list.tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    moveTask={moveTask}
                    cardId={list.id}
                  />
                ))}

                {addingToList === list.id ? (
                  <div className="add-card-input">
                    <Input
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onPressEnter={() => handleAddTask(list.id)}
                      autoFocus
                    />
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAddTask(list.id)}
                    >
                      Add
                    </Button>
                    <Button size="small" onClick={() => setAddingToList(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setAddingToList(list.id)}
                  >
                    Add a card 
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="new-list-placeholder">+ Add another list </div>
        </div>
      </div>

      {/* Modal Mời thành viên */}
      <Modal
        title="Invite to Board" 
        visible={isInviteModalVisible}
        onCancel={handleInviteModalClose}
        footer={null} // Đặt footer là null để loại bỏ các nút mặc định
        closeIcon={<CloseOutlined />} // Đặt icon đóng tùy chỉnh
        className="invite-modal" // Thêm class name để style riêng
      >
        <Input
          placeholder="Email address or name" 
          className="invite-email-input" // Class riêng cho input
        />
        <div className="invite-link-section">
          <Typography.Text className="invite-link-text">
            Invite someone to this Workspace with a link:
          </Typography.Text>
          <Button
            className="copy-link-button"
            onClick={handleCopyLink}
            icon={<CopyOutlined />} // Sử dụng CopyOutlined
          >
            Copy link
          </Button>
        </div>
        <Typography.Link className="disable-link-text">
          Disable link 
        </Typography.Link>
      </Modal>
    </DndProvider>
  );
}