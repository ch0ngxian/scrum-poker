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
  allowed_points: number[];
  active_voting_session_id: number;
}

export interface RoomUser {
  id: number;
  room_id: number;
  user_id: number;
}

export interface VotingSession {
  id: number;
  room_id: number;
  result: { point: number; count: number }[];
}

export interface Vote {
  id: number;
  voting_session_id: number;
  user_id: number;
  point: number;
}
