import { Anchor, Box, Button, Container, HStack } from "@hope-ui/solid";
import { Link } from "solid-app-router";
import { Component } from "solid-js";

const Navbar: Component = () => {
  return (
    <Box backgroundColor={"$neutral4"} py={"$1"} mb={"$3"}>
      <Container>
        <HStack gap={"$1"}>
          <Anchor as={Link} href={`/`}>
            <Button variant={"ghost"}>/aidg/ Prompts</Button>
          </Anchor>
          <Anchor as={Link} href={`/tags`}>
            <Button variant={"ghost"}>Tags</Button>
          </Anchor>
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;
