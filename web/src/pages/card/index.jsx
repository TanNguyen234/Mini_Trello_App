import React, { useState, useCallback, useRef } from "react";
import { Card, Input, Button, Modal, Typography } from "antd";
import { PlusOutlined, UserAddOutlined, CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.scss";
import TaskDetailModal from "../../components/detail/index";

const ItemType = {
  TASK: "TASK",
  LIST: "LIST", // Thêm loại item mới cho List
};

// TaskCard Component (Không thay đổi)
const TaskCard = ({ task, index, cardId, moveTask, moveTaskToList, onTaskClick }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { id: task.id, originalIndex: index, originalCardId: cardId, taskData: task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.TASK,
    hover(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.originalIndex;
      const hoverIndex = index;
      const sourceCardId = draggedItem.originalCardId;
      const targetCardId = cardId;

      if (draggedItem.id === task.id) {
          // No operation if hovering over itself
      }

      if (sourceCardId === targetCardId) {
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        
        moveTask(targetCardId, dragIndex, hoverIndex);
        draggedItem.originalIndex = hoverIndex;
      } else {
        moveTaskToList(sourceCardId, targetCardId, draggedItem.id, hoverIndex, draggedItem.taskData);
        draggedItem.originalCardId = targetCardId;
        draggedItem.originalIndex = hoverIndex;
      }
    },
  });

  drag(drop(ref));

  const handleClick = useCallback((e) => {
    if (isDragging) {
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    onTaskClick(task, cardId);
  }, [isDragging, onTaskClick, task, cardId]);

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.3 : 1, cursor: 'move' }}
      onClick={handleClick}
    >
      <Card className="card">
        {task.title}
      </Card>
    </div>
  );
};


// CardBoardDnD Component (Main Board)
export default function CardBoardDnD() {
  const [cards, setCards] = useState([
    { id: "card_1", name: "To do", tasks: [
        { id: "task_1", title: "Project planning", description: "This is a detailed description for project planning." },
        { id: "task_2", title: "Kickoff meeting", description: "Agenda for the kickoff meeting." },
    ]},
    { id: "card_2", name: "Doing", tasks: [] },
    { id: "card_3", name: "Done", tasks: [{ id: "task_3", title: "Wrap up", description: "Final tasks for project completion." }] },
  ]);

  const [newTaskText, setNewTaskText] = useState("");
  const [addingToList, setAddingToList] = useState(null);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isTaskDetailModalVisible, setIsTaskDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const handleAddTask = useCallback((listId) => {
    if (!newTaskText.trim()) return;
    setCards(prevCards =>
      prevCards.map(list =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, { id: `task_${Date.now()}`, title: newTaskText, description: '' }] }
          : list
      )
    );
    setNewTaskText("");
    setAddingToList(null);
  }, [newTaskText]);

  const moveTask = useCallback((listId, fromIndex, toIndex) => {
    setCards(prevCards => {
      const newCards = prevCards.map(card => ({ // Tạo bản sao sâu hơn một chút
        ...card,
        tasks: [...card.tasks]
      }));
      const targetCard = newCards.find(c => c.id === listId);
      if (!targetCard) return prevCards;

      const [movedTask] = targetCard.tasks.splice(fromIndex, 1);
      targetCard.tasks.splice(toIndex, 0, movedTask);
      return newCards;
    });
  }, []);

  const moveTaskToList = useCallback((sourceListId, destinationListId, taskId, targetIndexInDest, taskData) => {
    setCards(prevCards => {
      let taskToMove = taskData;
      let newCards = prevCards.map(card => ({ ...card, tasks: [...card.tasks] }));

      const sourceList = newCards.find(list => list.id === sourceListId);
      if (sourceList) {
        const taskIndexInSource = sourceList.tasks.findIndex(t => t.id === taskId);
        if (taskIndexInSource > -1) {
          if(!taskToMove) taskToMove = sourceList.tasks[taskIndexInSource];
          sourceList.tasks.splice(taskIndexInSource, 1);
        }
      } else {
        console.warn(`Source list ${sourceListId} not found.`);
        return prevCards;
      }

      if (!taskToMove) {
        console.error(`Task ${taskId} not found or taskData missing.`);
        return prevCards;
      }

      const destinationList = newCards.find(list => list.id === destinationListId);
      if (destinationList) {
        let validTargetIndex = targetIndexInDest;
        if (validTargetIndex < 0) validTargetIndex = 0;
        if (validTargetIndex > destinationList.tasks.length) validTargetIndex = destinationList.tasks.length;
        
        destinationList.tasks.splice(validTargetIndex, 0, taskToMove);
      } else {
        console.warn(`Destination list ${destinationListId} not found.`);
        return prevCards;
      }
      return newCards;
    });
  }, []);

  // Hàm mới để di chuyển list
  const moveList = useCallback((draggedId, hoverIndex) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const dragIndex = newCards.findIndex(card => card.id === draggedId);
      if (dragIndex === -1) return prevCards;

      const [movedList] = newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, movedList);
      return newCards;
    });
  }, []);

  const showInviteModal = useCallback(() => setIsInviteModalVisible(true), []);
  const handleInviteModalClose = useCallback(() => setIsInviteModalVisible(false), []);
  const handleCopyLink = useCallback(() => {
    const inviteLink = "https://your-app.com/invite/abcdef123";
    navigator.clipboard.writeText(inviteLink)
      .then(() => console.log("Link mời đã được copy!"))
      .catch((err) => console.error("Không thể copy link: ", err));
  }, []);

  const handleTaskClick = useCallback((task, listId) => {
    const list = cards.find(c => c.id === listId);
    setSelectedTask(task);
    setSelectedList(list);
    setIsTaskDetailModalVisible(true);
  }, [cards]);

  const handleCloseTaskDetailModal = useCallback(() => {
    setIsTaskDetailModalVisible(false);
    setSelectedTask(null);
    setSelectedList(null);
  }, []);

  // Wrapper cho mỗi List để làm nó thành drop target VÀ DRAG SOURCE
  const ListDropTargetWrapper = ({ list, index, children, moveList }) => { // Thêm index và moveList
    const ref = useRef(null);

    // useDrag cho List
    const [{ isDraggingList }, dragList] = useDrag({
      type: ItemType.LIST,
      item: { id: list.id, originalIndex: index }, // Bao gồm index gốc của list
      collect: (monitor) => ({
        isDraggingList: monitor.isDragging(),
      }),
    });

    // useDrop cho Task
    const [, dropTask] = useDrop({
      accept: ItemType.TASK,
      drop: (draggedItem, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        if (draggedItem.originalCardId !== list.id) {
          moveTaskToList(draggedItem.originalCardId, list.id, draggedItem.id, list.tasks.length, draggedItem.taskData);
        }
      },
      hover: (draggedItem, monitor) => {
        // Chỉ xử lý hover trên chính list (shallow), không phải TaskCard con
        if (monitor.getItemType() !== ItemType.TASK || !monitor.isOver({ shallow: true })) return;

        const sourceCardId = draggedItem.originalCardId;
        const targetCardId = list.id;

        // Nếu kéo từ list khác qua một list rỗng
        if (sourceCardId !== targetCardId && list.tasks.length === 0) {
          moveTaskToList(sourceCardId, targetCardId, draggedItem.id, 0, draggedItem.taskData);
          draggedItem.originalCardId = targetCardId;
          draggedItem.originalIndex = 0;
        }
      },
      collect: (monitor) => ({
        isOverTask: monitor.isOver({ shallow: true }),
        canDropTask: monitor.canDrop(),
      }),
    });

    // useDrop cho List (để các list khác có thể thả lên list này)
    const [, dropList] = useDrop({
      accept: ItemType.LIST,
      hover(draggedItem, monitor) {
        if (!ref.current) return;
        const dragIndex = draggedItem.originalIndex;
        const hoverIndex = index;

        // Không di chuyển nếu là cùng một list hoặc đã qua vị trí mong muốn
        if (dragIndex === hoverIndex) return;

        // Xác định vị trí tương đối của chuột để biết nên di chuyển sang trái hay phải
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;

        // Chỉ di chuyển khi con trỏ chuột đã đi qua giữa phần tử
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

        moveList(draggedItem.id, hoverIndex);
        draggedItem.originalIndex = hoverIndex; // Cập nhật index cho item đang kéo
      },
    });

    // Kết hợp cả ref cho drag và drop
    dragList(dropList(dropTask(ref))); // ref nhận cả drag (list) và drop (task, list)

    return (
      <div
        ref={ref}
        className="list"
        style={{
          backgroundColor: '#0E0F05', // Giữ màu nền cố định cho list
          opacity: isDraggingList ? 0.5 : 1, // Làm mờ list khi đang kéo
          cursor: isDraggingList ? 'grabbing' : 'grab', // Con trỏ chuột khi kéo list
          minHeight: '100px', // Đảm bảo list có chiều cao để thả vào ngay cả khi rỗng
          // Thêm border hoặc shadow để thể hiện vùng thả khi kéo list nếu muốn
          // border: isOverList && canDropList ? '2px dashed #000' : 'none',
        }}
      >
        {children}
      </div>
    );
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
          {cards.map((list, index) => ( // Truyền index của list
            <ListDropTargetWrapper key={list.id} list={list} index={index} moveList={moveList}>
              <h3>{list.name}</h3>
              <div className="cards">
                {list.tasks.map((task, taskIndex) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={taskIndex}
                    cardId={list.id}
                    moveTask={moveTask}
                    moveTaskToList={moveTaskToList}
                    onTaskClick={handleTaskClick}
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
                      <Button type="primary" size="small" onClick={() => handleAddTask(list.id)}>Add card</Button>
                      <Button size="small" onClick={() => setAddingToList(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button type="text" icon={<PlusOutlined />} onClick={() => setAddingToList(list.id)} className="ant-btn-text">
                    Add a card
                  </Button>
                )}
              </div>
            </ListDropTargetWrapper>
          ))}
          <div className="new-list-placeholder">+ Add another list </div>
        </div>
      </div>

      <Modal title="Invite to Board" open={isInviteModalVisible} onCancel={handleInviteModalClose} footer={null} closeIcon={<CloseOutlined />} className="invite-modal">
        <Input placeholder="Email address or name" className="invite-email-input" />
        <div className="invite-link-section">
          <Typography.Text className="invite-link-text">Invite someone to this Workspace with a link:</Typography.Text>
          <Button className="copy-link-button" onClick={handleCopyLink} icon={<CopyOutlined />}>Copy link</Button>
        </div>
        <Typography.Link className="disable-link-text">Disable link</Typography.Link>
      </Modal>

      {selectedTask && selectedList && (
        <TaskDetailModal
          isVisible={isTaskDetailModalVisible}
          onClose={handleCloseTaskDetailModal}
          task={{ ...selectedTask, listName: selectedList.name }}
        />
      )}
    </DndProvider>
  );
}