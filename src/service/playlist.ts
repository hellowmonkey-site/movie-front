export interface IPlay {
  app_id: number;
  circuit_id: number;
  circuit_name: string;
  created_at: number;
  id: number;
  origin_url: string;
  src: string;
  title: string;
  video_id: number;
}

export interface IPlayListGroup {
  circuit_id: number;
  circuit_name: string;
  list: IPlay[];
}
