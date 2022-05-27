import { Box } from "@hope-ui/solid";
import { ParentComponent } from "solid-js";

const Card: ParentComponent = (props) => {
  return (
    <Box
      borderColor={"$neutral6"}
      borderWidth={"0.1rem"}
      borderRadius={"0.2rem"}
      padding={"$4"}
      backgroundColor={"$neutral3"}
    >
      {props.children}
    </Box>
  );
};

export default Card;
