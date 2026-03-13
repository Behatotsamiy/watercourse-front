export interface IStudent {
  id: string;
  name: string;
  group: string;
  phone: string;
  balance: number;
  status: 'active' | 'debtor' | 'trial';
  joinedDate: string;
}

export const mockStudents: IStudent[] = [
  { id: '1', name: 'Алишер Усманов', group: 'Node.js Backend', phone: '+998 90 123 45 67', balance: 120000, status: 'active', joinedDate: '2024-02-10' },
  { id: '2', name: 'Мадина Саидова', group: 'React Frontend', phone: '+998 99 888 77 66', balance: -50000, status: 'debtor', joinedDate: '2024-03-01' },
  { id: '3', name: 'Жавохир Темиров', group: 'English B1', phone: '+998 93 555 44 33', balance: 0, status: 'trial', joinedDate: '2024-03-12' },
];