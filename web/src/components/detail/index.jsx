import React, { useState, useEffect } from 'react'; // Import useEffect
import { Modal, Input, Button, Avatar, Typography, Tooltip } from 'antd';
import {
  CloseOutlined,
  UserOutlined,
  BellOutlined,
  PlusOutlined,
  LinkOutlined, // For Attach Branch/Commit etc.
  ClockCircleOutlined // For Archive icon
} from '@ant-design/icons';
import './style.scss'; // Import SCSS cho modal này

const { TextArea } = Input;
const { Text } = Typography;

const TaskDetailModal = ({ isVisible, onClose, task }) => {
  // Chuẩn bị dữ liệu task cuối cùng để sử dụng trong modal, đảm bảo các mảng luôn tồn tại
  const finalTask = {
    title: task?.title || '',
    listName: task?.listName || '',
    description: task?.description || '',
    members: task?.members || [], // Đảm bảo luôn là một mảng
    comments: task?.comments || [], // Đảm bảo luôn là một mảng
    activityDetails: task?.activityDetails || [], // Đảm bảo luôn là một mảng
  };

  const [description, setDescription] = useState(finalTask.description);
  const [commentText, setCommentText] = useState('');

  // Sử dụng useEffect để cập nhật state description khi task thay đổi (khi mở modal cho task khác)
  useEffect(() => {
    setDescription(finalTask.description);
  }, [finalTask.description]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    // In một ứng dụng thực tế, bạn sẽ dispatch một action để lưu thay đổi này
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      // In một ứng dụng thực tế, bạn sẽ thêm comment này vào dữ liệu task và cập nhật state
      console.log('Adding comment:', commentText);
      setCommentText('');
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null} // Không có footer mặc định của Ant Design
      closeIcon={<CloseOutlined className="task-detail-close-icon" />}
      width={768} // Chiều rộng của modal theo thiết kế thông thường
      className="task-detail-modal"
      centered // Căn giữa modal trên màn hình
    >
      <div className="task-detail-header">
        <h2 className="task-title">{finalTask.title}</h2>
        <p className="task-list-info">in list <Text strong>{finalTask.listName}</Text></p>
      </div>

      <div className="task-detail-body">
        <div className="task-detail-main-content">
          {/* Members Section */}
          <div className="section members-section">
            <h3 className="section-title">Members</h3>
            <div className="member-list">
              {/* Sử dụng finalTask.members để đảm bảo nó là một mảng */}
              {finalTask.members.map(member => (
                <Tooltip title={member.name} key={member.id}>
                  <Avatar className="member-avatar" style={{ backgroundColor: '#695099' }}>{member.avatar}</Avatar>
                </Tooltip>
              ))}
              <Button type="text" className="add-member-button">
                <PlusOutlined />
              </Button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="section notification-section">
            <h3 className="section-title">Notifications</h3>
            <Button className="watch-button">
              <BellOutlined /> Watch
            </Button>
          </div>

          {/* Description Section */}
          <div className="section description-section">
            <h3 className="section-title">Description</h3>
            <TextArea
              className="description-textarea"
              placeholder="Add a more detailed description"
              autoSize={{ minRows: 3, maxRows: 6 }}
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* Activity Section */}
          <div className="section activity-section">
            <h3 className="section-title">Activity</h3>
            <div className="activity-controls">
              <Text className="show-details-text">Show details</Text>
            </div>
            <div className="comment-input-area">
              <Avatar className="comment-avatar" style={{ backgroundColor: '#87d068' }}>SD</Avatar> {/* Avatar người comment */}
              <Input
                className="comment-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onPressEnter={handleAddComment}
              />
            </div>
            {/* Display comments here if any, for now, just placeholder */}
            {/* Sử dụng finalTask.comments để đảm bảo nó là một mảng */}
            {finalTask.comments.length > 0 ? (
                finalTask.comments.map(comment => (
                    comment.isPlaceholder && ( // Chỉ hiển thị placeholder nếu có cờ này
                        <div key={comment.id} className="comment-placeholder">
                            <Avatar className="comment-avatar-placeholder" style={{ backgroundColor: '#87d068' }}>{comment.user}</Avatar>
                            <div className="comment-placeholder-text">{comment.text}</div>
                        </div>
                    )
                ))
            ) : (
                // Nếu không có comment nào, có thể hiển thị một thông báo hoặc không gì cả
                null
            )}
          </div>
        </div>

        <div className="task-detail-sidebar">
          {/* Add to card Section */}
          <div className="sidebar-section add-to-card-section">
            <h3 className="sidebar-section-title">Add to card</h3>
            <Button className="sidebar-button">
              <UserOutlined /> Members
            </Button>
            <Button className="sidebar-button">
              <PlusOutlined /> Power-Ups
            </Button>
            {/* GitHub Section */}
            <div className="github-section">
                <h4 className="github-title">GitHub</h4>
                <Button className="github-attach-button"><LinkOutlined /> Attach Branch</Button>
                <Button className="github-attach-button"><LinkOutlined /> Attach Commit</Button>
                <Button className="github-attach-button"><LinkOutlined /> Attach Issue</Button>
                <Button className="github-attach-button"><LinkOutlined /> Attach Pull Request</Button>
            </div>
          </div>

          {/* Actions Section */}
          <div className="sidebar-section actions-section">
            <h3 className="sidebar-section-title">Actions</h3>
            <Button className="sidebar-button archive-button">
              <ClockCircleOutlined /> Archive
            </Button>
          </div>
        </div>
        </div>
      </Modal>
  );
};

export default TaskDetailModal;