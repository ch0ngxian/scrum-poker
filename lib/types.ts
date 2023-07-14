export interface User {
  id: number;
  name: string;
  token: string;
}

export interface Room {
  id: number;
  owner_id: number;
  handle: string;
  owner: User;
  members: User[];
}

export interface RoomUsers {
  id: number;
  room_id: number;
  user_id: number;
}
