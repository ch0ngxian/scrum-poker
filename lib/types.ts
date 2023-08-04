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
  votes?: {
    [key: number]: number;
  };
  result?: { point: number; count: number }[];
}
