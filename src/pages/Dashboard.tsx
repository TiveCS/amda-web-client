import { BackgroundImage } from "@mantine/core";
import Bg from "/assets/img/background-biru.png";

function Dashboard() {
  return (
    <div
      style={{
        position: "absolute",
        width: "75%",
        height: "100%",
      }}
    >
      <BackgroundImage
        src={Bg}
        style={{ width: "100%", height: "100%", backgroundSize: "cover" }}
      ></BackgroundImage>
    </div>
  );
}

export default Dashboard;
