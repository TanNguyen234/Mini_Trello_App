import React, { useState, useCallback } from "react"; // Import useCallback for memoized functions
import { Card, Input, Button, Modal, Typography } from "antd";
import { PlusOutlined, UserAddOutlined, CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.scss";
import TaskDetailModal from "../../components/detail/index"; // Import TaskDetailModal

const ItemType = {
  TASK: "TASK",
};

const TaskCard = ({ task, index, moveTask, cardId, onTaskClick }) => { // Add onTaskClick prop
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.TASK,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      // Chỉ di chuyển nếu item nằm trong cùng một list hoặc được sắp xếp lại cụ thể
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

  // Gắn drag và drop vào ref
  drag(drop(ref));

  const handleClick = useCallback((e) => {
    // Ngăn chặn mở modal nếu đây là hành động kéo
    if (isDragging) {
      return;
    }
    // Ngăn chặn sự kiện nổi bọt để tránh kích hoạt các sự kiện drop ở cấp list không mong muốn
    e.stopPropagation();
    onTaskClick(task, cardId);
  }, [isDragging, onTaskClick, task, cardId]);

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="card" onClick={handleClick}> {/* Add onClick */}
        {task.title}
      </Card>
    </div>
  );
};

export default function CardBoardDnD() {
  const [cards, setCards] = useState([
    {
      id: "card_1",
      name: "To do",
      tasks: [
        { id: "task_1", title: "Project planning", description: "This is a detailed description for project planning." },
        { id: "task_2", title: "Kickoff meeting", description: "Agenda for the kickoff meeting." },
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
      tasks: [{ id: "task_3", title: "Wrap up", description: "Final tasks for project completion." }],
    },
  ]);

  const [newTaskText, setNewTaskText] = useState("");
  const [addingToList, setAddingToList] = useState(null);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

  // States for TaskDetailModal
  const [isTaskDetailModalVisible, setIsTaskDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedList, setSelectedList] = useState(null); // Để lấy tên list cho modal

  const handleAddTask = useCallback((cardId) => {
    if (!newTaskText.trim()) return;
    const updated = cards.map((list) =>
      list.id === cardId
        ? {
            ...list,
            tasks: [
              ...list.tasks,
              { id: `task_${Date.now()}`, title: newTaskText, description: '' }, // Đảm bảo thêm description
            ],
          }
        : list
    );
    setCards(updated);
    setNewTaskText("");
    setAddingToList(null);
  }, [cards, newTaskText]);

  // Hàm `moveTask` này hiện tại chỉ xử lý việc sắp xếp lại trong cùng một list.
  // Để kéo thả giữa các list, cần có thêm `useDrop` trên các container list và logic `moveTaskBetweenLists`.
  const moveTask = useCallback((cardId, fromIndex, toIndex) => {
    const updated = [...cards];
    const targetCard = updated.find((c) => c.id === cardId);
    if (!targetCard) return;
    const [moved] = targetCard.tasks.splice(fromIndex, 1);
    targetCard.tasks.splice(toIndex, 0, moved);
    setCards(updated);
  }, [cards]);

  const showInviteModal = useCallback(() => {
    setIsInviteModalVisible(true);
  }, []);

  const handleInviteModalClose = useCallback(() => {
    setIsInviteModalVisible(false);
  }, []);

  const handleCopyLink = useCallback(() => {
    const inviteLink = "https://your-app.com/invite/abcdef123"; // Thay thế bằng link mời thực tế của bạn
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        console.log("Link mời đã được copy!");
        // Bạn có thể thêm thông báo thành công ở đây (ví dụ: Ant Design Message.success)
      })
      .catch((err) => {
        console.error("Không thể copy link: ", err);
      });
  }, []);

  const handleTaskClick = useCallback((task, cardId) => {
    const list = cards.find(c => c.id === cardId);
    setSelectedTask(task);
    setSelectedList(list); // Truyền toàn bộ đối tượng list để lấy tên
    setIsTaskDetailModalVisible(true);
  }, [cards]);

  const handleCloseTaskDetailModal = useCallback(() => {
    setIsTaskDetailModalVisible(false);
    setSelectedTask(null);
    setSelectedList(null);
  }, []);

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
                    onTaskClick={handleTaskClick} // Truyền prop handleTaskClick
                  />
                ))}

                {addingToList === list.id ? (
                  <div className="add-card-input">
                    <Input
                      placeholder="Enter a title for this card..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onPressEnter={() => handleAddTask(list.id)}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleAddTask(list.id)}
                      >
                        Add card
                      </Button>
                      <Button size="small" onClick={() => setAddingToList(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setAddingToList(list.id)}
                    className="ant-btn-text"
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
        open={isInviteModalVisible} // Sử dụng `open` thay cho `visible`
        onCancel={handleInviteModalClose}
        footer={null}
        closeIcon={<CloseOutlined />}
        className="invite-modal"
      >
        <Input
          placeholder="Email address or name"
          className="invite-email-input"
        />
        <div className="invite-link-section">
          <Typography.Text className="invite-link-text">
            Invite someone to this Workspace with a link:
          </Typography.Text>
          <Button
            className="copy-link-button"
            onClick={handleCopyLink}
            icon={<CopyOutlined />}
          >
            Copy link
          </Button>
        </div>
        <Typography.Link className="disable-link-text">
          Disable link
        </Typography.Link>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && selectedList && ( // Chỉ render nếu cả task và list được chọn
        <TaskDetailModal
          isVisible={isTaskDetailModalVisible}
          onClose={handleCloseTaskDetailModal}
          task={{ ...selectedTask, listName: selectedList.name }} // Truyền dữ liệu task bao gồm tên list
        />
      )}
    </DndProvider>
  );
}