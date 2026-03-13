export interface ITeacher {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  specialization?: string;
  groupsCount?: number;
  phone: string;
  status: 'teacher' | 'support' 
  joinedDate: string;
}

export const mockTeachers: ITeacher[] = [
  { id: '1', name: 'Алишер Усманов', age: 25, avatar: '/avatars/alisher.jpg', specialization: 'Mathematics', groupsCount: 5, phone: '+998 90 123 45 67', status: 'teacher', joinedDate: '2024-02-10' },
  { id: '2', name: 'Мадина Саидова', age: 28, avatar: '/avatars/madina.jpg', specialization: 'Physics', groupsCount: 3, phone: '+998 99 888 77 66', status: 'support', joinedDate: '2024-03-01' },
  { id: '3', name: 'Жавохир Темиров', age: 30, avatar: '/avatars/javohir.jpg', specialization: 'Chemistry', groupsCount: 4, phone: '+998 93 555 44 33', status: 'teacher', joinedDate: '2024-03-12' },
];