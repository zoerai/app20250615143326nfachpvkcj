
-- 创建待办事项表
CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    due_date TIMESTAMP WITH TIME ZONE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为常用查询字段创建索引
CREATE INDEX idx_todos_is_completed ON todos(is_completed);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_create_time ON todos(create_time);

-- 创建触发器函数来自动更新 modify_time
CREATE OR REPLACE FUNCTION update_modify_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modify_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 todos 表创建触发器
CREATE TRIGGER trigger_update_todos_modify_time
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_modify_time();

-- 插入测试数据
INSERT INTO todos (title, description, is_completed, priority, due_date) VALUES
('完成项目报告', '整理本月项目进展，准备汇报材料', FALSE, 5, '2024-01-15 18:00:00+08'),
('购买生活用品', '牛奶、面包、洗发水、牙膏', FALSE, 2, '2024-01-12 20:00:00+08'),
('健身锻炼', '跑步30分钟，力量训练', TRUE, 3, '2024-01-10 19:00:00+08'),
('学习新技术', '阅读PostgreSQL官方文档，练习SQL查询', FALSE, 4, '2024-01-20 22:00:00+08'),
('整理房间', '清理桌面，整理书籍和文件', TRUE, 2, '2024-01-08 16:00:00+08'),
('准备会议材料', '收集数据，制作PPT演示文稿', FALSE, 5, '2024-01-14 09:00:00+08'),
('联系客户', '回复邮件，安排下次会面时间', FALSE, 4, '2024-01-13 14:00:00+08'),
('备份重要文件', '将工作文档备份到云端存储', FALSE, 3, '2024-01-16 17:00:00+08'),
('预约体检', '联系医院，安排年度健康检查', FALSE, 3, '2024-01-25 10:00:00+08'),
('更新简历', '添加最新工作经历和技能', FALSE, 2, '2024-01-30 20:00:00+08');
