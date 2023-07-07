export interface User {
  id: Number;
  name: string;
  token: string;
}

export interface Room {
  id: Number;
  owner_id: Number;
}

export interface RoomUsers {
  id: Number;
  room_id: Number;
  user_id: Number;
}
