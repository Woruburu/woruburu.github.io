import {
  Anchor,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
} from "@hope-ui/solid";
import Card from "Components/Card";
import { format } from "date-fns";
import { HomePrompt } from "Services/SqljsService";
import { Link } from "solid-app-router";
import { Component, For, Show } from "solid-js";

const HomePromptDisplay: Component<{ prompt: HomePrompt }> = (props) => {
  return (
    <Card>
      <Stack height={"100%"} direction={"column"} gap="$3">
        <Box>
          <Anchor as={Link} href={`/${props.prompt.CorrelationId}`}>
            <Heading level={2} size={"xl"}>
              {props.prompt.Title}
            </Heading>
          </Anchor>
        </Box>
        <Box>
          <Text
            tabIndex={-1}
            noOfLines={2}
            _hover={{
              "-webkit-line-clamp": "initial",
            }}
            _focus={{
              "-webkit-line-clamp": "initial",
            }}
          >
            Created:{" "}
            {format(
              props.prompt.PublishDate ?? props.prompt.DateCreated,
              "yyyy/MM/dd"
            )}
            <br />
            Tags:
            <Show when={props.prompt.Nsfw}>
              <Badge
                textTransform={"lowercase"}
                colorScheme={"danger"}
                marginLeft={"$1"}
              >
                nsfw
              </Badge>
            </Show>
            <For each={props.prompt.Tags.split(",")}>
              {(tag) => (
                <Anchor as={Link} href={`/?tag=${tag.trim()}`}>
                  <Badge
                    textTransform={"lowercase"}
                    colorScheme={"primary"}
                    marginLeft={"$1"}
                  >
                    {tag.trim()}
                  </Badge>
                </Anchor>
              )}
            </For>
          </Text>
        </Box>
        <Box>
          <Text noOfLines={4}>
            <Show
              when={props.prompt.Description}
              fallback={props.prompt.PromptContent}
            >
              {(desc) => desc}
            </Show>
          </Text>
        </Box>
        <Flex mt={"auto"}>
          <Anchor ml={"auto"} as={Link} href={`/${props.prompt.CorrelationId}`}>
            <Button type={"button"}>View Prompt</Button>
          </Anchor>
        </Flex>
      </Stack>
    </Card>
  );
};

export default HomePromptDisplay;
