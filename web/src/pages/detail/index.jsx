// src/pages/CardDetailPage/CardDetailPage.jsx
import React from 'react';
import { Button, Input, Avatar, Tag, Typography } from 'antd';
import { UserOutlined, ClockCircleOutlined, PlusOutlined, GithubOutlined } from '@ant-design/icons';
import MainLayout from '../../components/MainLayout/MainLayout.jsx';
import './CardDetailPage.scss';

const { Title, Paragraph, Text } = Typography;

const CardDetailPage = () => {
  return (
    <MainLayout>
      <div className="card-detail-container">
        <div className="card-detail-main">
          <Title level={3} className="card-detail-title">Project planning</Title>
          <Paragraph className="card-detail-list-context">in list <Tag color="blue">To do</Tag></Paragraph>

          <div className="card-detail-section">
            <Text strong>Members</Text>
            <div className="card-detail-members-avatars">
              <Avatar icon={<UserOutlined />} className="card-detail-member-avatar" />
              <Button type="text" icon={<PlusOutlined />} className="card-detail-add-member-button" />
            </div>
          </div>

          <div className="card-detail-section">
            <Text strong>Description</Text>
            <Input.TextArea
              placeholder="Add a more detailed description"
              autoSize={{ minRows: 3, maxRows: 5 }}
              className="card-detail-description-textarea"
            />
          </div>

          <div className="card-detail-section">
            <Text strong>Activity</Text>
            <div className="card-detail-activity-header">
              <Input placeholder="Write a comment" className="card-detail-comment-input" />
            </div>
            <Button type="text" className="card-detail-show-details-button">
              Show details
            </Button>
          </div>
        </div>

        <div className="card-detail-sidebar">
          <Text strong>Add to card</Text>
          <Button block className="sidebar-button">Members</Button>
          <Button block className="sidebar-button" icon={<ClockCircleOutlined />}>Watch</Button>
          <Button block className="sidebar-button">Archive</Button>
          <Button block className="sidebar-button">X</Button>

          <Text strong className="sidebar-power-ups-title">Power-Ups</Text>
          <Button block className="sidebar-button" icon={<GithubOutlined />}>GitHub</Button>
          <Button block className="sidebar-button">Attach Branch</Button>
          <Button block className="sidebar-button">Attach Commit</Button>
          <Button block className="sidebar-button">Attach Issue</Button>
          <Button block className="sidebar-button">Attach Pull Request....</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CardDetailPage;