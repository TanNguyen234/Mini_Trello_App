import React, { useState, useCallback, useRef } from "react";
import { Card, Input, Button, Modal, Typography } from "antd";
import { PlusOutlined, UserAddOutlined, CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./style.scss"; // Giả sử bạn có file style.scss
import TaskDetailModal from "../../components/detail/index"; // Import TaskDetailModal

const ItemType = {
  TASK: "TASK",
};

// TaskCard Component
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
      const targetCardId = cardId; // ID của list mà TaskCard này thuộc về

      // Không thay thế item bằng chính nó
      if (draggedItem.id === task.id) { // Nếu cùng ID và đang hover trên chính nó
         // Nếu bạn muốn cho phép drop lên chính nó mà không làm gì, thì return ở đây.
         // Hoặc nếu logic ở dưới đã xử lý sourceCardId === targetCardId và dragIndex === hoverIndex thì cũng được.
      }

      // Nếu kéo thả trong cùng một list
      if (sourceCardId === targetCardId) {
        if (dragIndex === hoverIndex) { // Đang hover trên chính vị trí cũ trong cùng list
          return;
        }
        // Xác định vị trí tương đối của chuột và item đang hover
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Chỉ di chuyển khi chuột đã qua nửa chiều cao của item
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        
        moveTask(targetCardId, dragIndex, hoverIndex);
        draggedItem.originalIndex = hoverIndex; // Cập nhật index của item đang kéo
      } else { // Kéo thả sang một list khác và đang hover lên một TaskCard trong list đó
        // Logic tương tự để xác định có nên "chen" vào vị trí này không
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Tạm thời chưa cần check kỹ vị trí Y khi kéo sang list khác,
        // vì việc chèn vào vị trí hoverIndex là đủ.
        // Quan trọng là phải gọi moveTaskToList và cập nhật item đang kéo.
        
        // Di chuyển task sang list mới tại vị trí hoverIndex
        moveTaskToList(sourceCardId, targetCardId, draggedItem.id, hoverIndex, draggedItem.taskData);
        
        // Cập nhật thông tin cho item đang kéo để nó "biết" nó đã sang list mới
        draggedItem.originalCardId = targetCardId;
        draggedItem.originalIndex = hoverIndex;
      }
    },
  });

  drag(drop(ref));

  const handleClick = useCallback((e) => {
    if (isDragging) {
      e.stopPropagation(); // Ngăn click nếu đó là kết thúc của một hành động kéo
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
      let taskToMove = taskData; // Dữ liệu task đã có sẵn từ draggedItem
      let newCards = prevCards.map(card => ({ ...card, tasks: [...card.tasks] })); // Clone sâu

      // 1. Xóa task khỏi list nguồn
      const sourceList = newCards.find(list => list.id === sourceListId);
      if (sourceList) {
        const taskIndexInSource = sourceList.tasks.findIndex(t => t.id === taskId);
        if (taskIndexInSource > -1) {
            // Nếu taskData không được truyền, lấy từ sourceList (cẩn thận nếu taskData đã bị thay đổi)
            // Tuy nhiên, với cách setup item trong useDrag, taskData đã là bản snapshot lúc bắt đầu kéo.
          if(!taskToMove) taskToMove = sourceList.tasks[taskIndexInSource];
          sourceList.tasks.splice(taskIndexInSource, 1);
        }
      } else {
        console.warn(`Source list ${sourceListId} not found.`);
        return prevCards; // Hoặc xử lý lỗi
      }

      if (!taskToMove) {
        console.error(`Task ${taskId} not found or taskData missing.`);
        return prevCards;
      }

      // 2. Thêm task vào list đích
      const destinationList = newCards.find(list => list.id === destinationListId);
      if (destinationList) {
        // Đảm bảo targetIndexInDest nằm trong giới hạn hợp lệ
        let validTargetIndex = targetIndexInDest;
        if (validTargetIndex < 0) validTargetIndex = 0;
        if (validTargetIndex > destinationList.tasks.length) validTargetIndex = destinationList.tasks.length;
        
        destinationList.tasks.splice(validTargetIndex, 0, taskToMove);
      } else {
        console.warn(`Destination list ${destinationListId} not found.`);
        // Có thể quyết định thêm lại task vào source list nếu đích không tồn tại
        // hoặc xử lý lỗi khác.
        return prevCards;
      }
      return newCards;
    });
  }, []); // Không cần 'cards' ở đây nếu taskData luôn được truyền

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

  // Wrapper cho mỗi List để làm nó thành drop target
  const ListDropTargetWrapper = ({ list, children }) => {
    const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: ItemType.TASK,
      drop: (draggedItem, monitor) => {
        if (monitor.didDrop()) { // Nếu một TaskCard con đã xử lý drop
          return;
        }
        // Chỉ xử lý nếu task từ list khác và thả trực tiếp vào list này (không phải lên TaskCard con)
        if (draggedItem.originalCardId !== list.id) {
          // Thêm vào cuối list này
          moveTaskToList(draggedItem.originalCardId, list.id, draggedItem.id, list.tasks.length, draggedItem.taskData);
        }
      },
      hover: (draggedItem, monitor) => {
        // Chỉ xử lý hover trên chính list (shallow), không phải TaskCard con
        if (!monitor.isOver({ shallow: true })) return;

        const sourceCardId = draggedItem.originalCardId;
        const targetCardId = list.id;

        // Nếu kéo từ list khác qua một list rỗng
        if (sourceCardId !== targetCardId && list.tasks.length === 0) {
          // "Tạm thời" di chuyển task vào list rỗng này
          moveTaskToList(sourceCardId, targetCardId, draggedItem.id, 0, draggedItem.taskData);
          // Cập nhật trạng thái của item đang kéo
          draggedItem.originalCardId = targetCardId;
          draggedItem.originalIndex = 0;
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div 
        ref={dropRef} 
        className="list" 
        style={{ 
          backgroundColor: isOver && canDrop ? 'rgba(0,0,0,0.05)' : 'transparent', 
          minHeight: '100px' // Đảm bảo list có chiều cao để thả vào ngay cả khi rỗng
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
          {cards.map((list) => (
            <ListDropTargetWrapper key={list.id} list={list}>
              <h3>{list.name}</h3>
              <div className="cards"> {/* Vùng chứa các TaskCard */}
                {list.tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    cardId={list.id} // ID của list chứa TaskCard này
                    moveTask={moveTask}
                    moveTaskToList={moveTaskToList}
                    onTaskClick={handleTaskClick}
                  />
                ))}
                {/* Phần thêm card mới */}
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

      {/* Modal Mời thành viên */}
      <Modal title="Invite to Board" open={isInviteModalVisible} onCancel={handleInviteModalClose} footer={null} closeIcon={<CloseOutlined />} className="invite-modal">
        <Input placeholder="Email address or name" className="invite-email-input" />
        <div className="invite-link-section">
          <Typography.Text className="invite-link-text">Invite someone to this Workspace with a link:</Typography.Text>
          <Button className="copy-link-button" onClick={handleCopyLink} icon={<CopyOutlined />}>Copy link</Button>
        </div>
        <Typography.Link className="disable-link-text">Disable link</Typography.Link>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && selectedList && (
        <TaskDetailModal
          isVisible={isTaskDetailModalVisible} // Prop của TaskDetailModal
          onClose={handleCloseTaskDetailModal}
          task={{ ...selectedTask, listName: selectedList.name }}
        />
      )}
    </DndProvider>
  );
}