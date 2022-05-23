import { createContext } from "react";

const UserContext = createContext({
  userContextData: {},
  setUserContextData: () => {}
});

export default UserContext;