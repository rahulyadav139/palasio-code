export interface IUserContext {
  user: IUser | null;
  isLoading: boolean;
  getUser: () => Promise<void>;
  removeUser: () => void;
}
