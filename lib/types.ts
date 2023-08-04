export interface User {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  owner: User;
  members: User[];
  allowed_points: number[];
  active_voting_session: VotingSession;
}

export interface RoomUser {
  id: string;
  room_id: string;
  user_id: string;
}

export interface VotingSession {
  id: string;
  room: Room;
  result: { point: number; count: number }[];
}

export interface Vote {
  id: string;
  voting_session: VotingSession;
  user: User;
  point: number;
}
