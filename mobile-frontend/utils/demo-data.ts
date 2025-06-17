import { SQLiteDatabase } from 'expo-sqlite';

// Demo messages data
const DEMO_MESSAGES = [
  {
    id: 90001,
    title: '学校からのお知らせ',
    content: '来週月曜日は授業参観日です。保護者の皆様のご参加をお待ちしております。時間は午前10時から12時までです。',
    priority: 'high',
    sent_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '), // 1 day ago
    group_name: 'Principal',
    student_id: 80001,
    student_number: 'S2024001',
    read_status: 0,
  },
  {
    id: 90002,
    title: '宿題のお知らせ',
    content: '明日までに数学のワークブック第5章を完成させてください。分からない問題があれば、授業中に質問してください。',
    priority: 'low',
    sent_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '), // 2 days ago
    group_name: 'Math Teacher',
    student_id: 80001,
    student_number: 'S2024001',
    read_status: 1,
  },
  {
    id: 90003,
    title: '保健室からのお知らせ',
    content: 'インフルエンザが流行しています。手洗い・うがいを徹底し、体調不良の場合は無理せず休養してください。',
    priority: 'high',
    sent_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '), // 3 days ago
    group_name: 'School Nurse',
    student_id: 80001,
    student_number: 'S2024001',
    read_status: 1,
  },
  {
    id: 90004,
    title: '部活動の連絡',
    content: '今週土曜日の練習は天候により中止となりました。来週の予定は後日お知らせします。',
    priority: 'medium',
    sent_time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '), // 4 days ago
    group_name: 'Club Advisor',
    student_id: 80002,
    student_number: 'S2024002',
    read_status: 0,
  },
  {
    id: 90005,
    title: '学費納入のお願い',
    content: '今月末が学費納入期限となっております。お忘れのないようお願いいたします。詳細は配布済みの書類をご確認ください。',
    priority: 'high',
    sent_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '), // 5 days ago
    group_name: 'Administration',
    student_id: 80001,
    student_number: 'S2024001',
    read_status: 0,
  },
  {
    id: 90006,
    title: '遠足のお知らせ',
    content: '来月の遠足の詳細が決まりました。行き先は科学博物館です。お弁当と水筒を忘れずに持参してください。',
    priority: 'low',
    sent_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '), // 7 days ago
    group_name: 'Homeroom Teacher',
    student_id: 80002,
    student_number: 'S2024002',
    read_status: 1,
  },
];

// Demo students data
const DEMO_STUDENTS = [
  {
    id: 80001,
    student_number: 'S2024001',
    family_name: '山田',
    given_name: '太郎',
    phone_number: '+819012345678',
    email: 'yamada.taro@example.com',
  },
  {
    id: 80002,
    student_number: 'S2024002',
    family_name: '佐藤',
    given_name: '花子',
    phone_number: '+819087654321',
    email: 'sato.hanako@example.com',
  },
];

export async function initializeDemoData(db: SQLiteDatabase) {
  try {
    // Clear existing demo data - using specific IDs instead of LIKE pattern
    await db.runAsync("DELETE FROM message WHERE id >= 90000");
    await db.runAsync("DELETE FROM student WHERE id >= 80000");
    
    // Insert demo students
    for (const student of DEMO_STUDENTS) {
      await db.runAsync(
        'INSERT OR REPLACE INTO student (id, student_number, family_name, given_name, phone_number, email) VALUES ($id, $student_number, $family_name, $given_name, $phone_number, $email)',
        [
          student.id,
          student.student_number,
          student.family_name,
          student.given_name,
          student.phone_number,
          student.email,
        ]
      );
    }
    
    // Insert demo messages
    for (const message of DEMO_MESSAGES) {
      await db.runAsync(
        `INSERT OR REPLACE INTO message (
          id, title, content, priority, sent_time, group_name, student_id, student_number, read_status
        ) VALUES (
          $id, $title, $content, $priority, $sent_time, $group_name, $student_id, $student_number, $read_status
        )`,
        [
          message.id,
          message.title,
          message.content,
          message.priority,
          message.sent_time,
          message.group_name,
          message.student_id,
          message.student_number,
          message.read_status,
        ]
      );
    }
    
    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
    throw error;
  }
}

// Toggle read status for demo messages
export async function toggleDemoMessageReadStatus(
  db: SQLiteDatabase,
  messageId: string
): Promise<void> {
  try {
    // Get current read status
    const result = await db.getFirstAsync<{ read_status: number }>(
      'SELECT read_status FROM message WHERE id = ?',
      [messageId]
    );
    
    if (result) {
      const newReadStatus = result.read_status === 0 ? 1 : 0;
      const readTime = newReadStatus === 1 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
      await db.runAsync(
        'UPDATE message SET read_status = ?, read_time = ? WHERE id = ?',
        [newReadStatus, readTime, messageId]
      );
    }
  } catch (error) {
    console.error('Error toggling message read status:', error);
    throw error;
  }
}