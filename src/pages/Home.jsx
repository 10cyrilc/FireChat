import ChatScreen from "../components/ChatScreen";
import SideBar from "../components/SideBar";

function Home() {
  return (
    <div className="home">
      <div className="container">
        <SideBar />
        <ChatScreen />
      </div>
    </div>
  );
}

export default Home;
