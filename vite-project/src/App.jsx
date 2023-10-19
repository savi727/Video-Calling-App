import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:8000");

function App() {
  const [initialConnection, setInitialConnection] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);

  const initConnect = (data) => {
    console.log("connected");
    setInitialConnection(data);
  };

  const sendMessage = (e, msg) => {
    e.preventDefault();
    socket.emit("message", msg);
    setMsg("");
  };
  const showChats = (data) => {
    setChat((prev) => [...prev, data]);
  };

 const showConnectedUsers = (user) => {
    setUsers((prev)=> [...prev,user])
 } 
  useEffect(() => {
    socket.on("connected", initConnect);
    socket.on("send-message", showChats);
    socket.on ("connected-user", showConnectedUsers)

    return () => {
      socket.off("message", initConnect);
      socket.off("send-message", showChats);
    };
  }, []);

  return !initialConnection ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <h1>{initialConnection}</h1>
      <ul style = {{position : "absolute", top : "20%", right : "1rem"}}>
      {users.map((user, i) => {
        return <li key = {i} >{user}</li>
      })}

      </ul>
      <form onSubmit={(e) => sendMessage(e, msg)}>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {chat.map((msg, index) => {
          return <p key={index}>{msg}</p>;
        })}
      </ul>
    </>
  );
}

export default App;
