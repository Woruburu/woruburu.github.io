import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Anchor,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@hope-ui/solid";
import Card from "Components/Card";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { Child, Prompt, WorldInfo } from "Services/SqljsService";
import { Link } from "solid-app-router";
import { Component, createSignal, For, ParentComponent, Show } from "solid-js";
import { v4 } from "uuid";

const ExportOptions: Component<{ prompt: Prompt }> = (props) => {
  const [naiClipboardState, setNaiClipboardState] = createSignal<
    "Ready" | "Pasting" | "Pasted"
  >("Ready");

  const generateHoloScenario = (): string => {
    const prompt = props.prompt;
    return JSON.stringify({
      genMeta: {
        dataset: 0,
        literotica: {
          author: "",
          category: "",
          tags: [],
          targetLength: 5000,
        },
        goodReads: {
          author: "",
          pubDate: 2020,
          tags: [],
          targetLength: 25000,
        },
      },
      snippets: [],
      version: 6,
      title: prompt.Title,
      content: prompt.PromptContent.split(/(\r\n|\n)+/).map((para) => ({
        type: "paragraph",
        children: [{ text: para }],
      })),
      memory: prompt.Memory,
      authorsNote: prompt.AuthorsNote,
      worldInfo: prompt.WorldInfos.map((wi) => ({
        rank: 1,
        value: wi.Entry,
        keys: wi.Keys.split(",").map((key) => key.trim()),
      })),
      tags: prompt.Tags.split(",").map((tag) => tag.trim()),
    });
  };

  const holoScenarioClick = () => {
    const json = props.prompt.HoloAiScenario ?? generateHoloScenario();
    const blob = new Blob([json], {
      type: "application/json",
    });
    saveAs(blob, `${props.prompt.Title}.holo`);
  };

  const generateNaiScenario = (): string => {
    const prompt = props.prompt;
    return JSON.stringify({
      scenarioVersion: 0,
      title: prompt.Title,
      description: prompt.Description ?? "",
      prompt: prompt.PromptContent,
      tags: prompt.Tags.split(",").map((tag) => tag.trim()),
      context: [
        {
          text: prompt.Memory?.trim() ?? "",
          contextConfig: {
            prefix: "",
            suffix: "\n",
            tokenBudget: 2048,
            reservedTokens: 0,
            budgetPriority: 800,
            trimDirection: "trimBottom",
            insertionType: "token",
            insertionPosition: 0,
          },
        },
        {
          text: prompt.AuthorsNote?.trim() ?? "",
          contextConfig: {
            prefix: "",
            suffix: "\n",
            tokenBudget: 2048,
            reservedTokens: 2048,
            budgetPriority: -400,
            trimDirection: "trimBottom",
            insertionType: "newline",
            insertionPosition: -4,
          },
        },
      ],
      loreBook: {
        lorebookVersion: 1,
        entries: prompt.WorldInfos.map((wi) => {
          return {
            keys: wi.Keys.split(",").map((key) => key.trim()),
            text: wi.Entry,
            displayName: wi.Keys[0]?.trim() ?? "",
          };
        }),
      },
    });
  };

  const naiScenarioClick = () => {
    const json = props.prompt.NovelAiScenario ?? generateNaiScenario();
    const blob = new Blob([json], {
      type: "application/json",
    });
    saveAs(blob, `${props.prompt.Title}.scenario`);
  };

  const naiClipboardClick = async () => {
    const json = props.prompt.NovelAiScenario ?? generateNaiScenario();
    setNaiClipboardState("Pasting");
    await navigator.clipboard.writeText(json);
    setNaiClipboardState("Pasted");
    setTimeout(() => {
      setNaiClipboardState("Ready");
    }, 2000);
  };

  return (
    <Accordion mb={"$1"}>
      <AccordionItem>
        <Heading level={2}>
          <AccordionButton>
            <Text flex={1} fontWeight="$medium" textAlign="start">
              Export Options
            </Text>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel px={0} pb={0}>
          <Card>
            <Heading level={1} size={"xl"} mb={"$2"}>
              NAI
            </Heading>
            <HStack gap={"$3"}>
              <Button onClick={naiScenarioClick}>Download .scenario</Button>
              <Button
                disabled={naiClipboardState() !== "Ready"}
                onClick={naiClipboardClick}
                variant={"outline"}
                colorScheme={"neutral"}
              >
                <Show
                  when={naiClipboardState() === "Pasted"}
                  fallback={"Copy to clipboard"}
                >
                  Copied!
                </Show>
              </Button>
            </HStack>
            <Divider thickness={"$0_5"} my={"$4"} />
            <Heading level={1} size={"xl"} mb={"$2"}>
              HoloAI
            </Heading>
            <Button onClick={holoScenarioClick}>Download .holo</Button>
          </Card>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const WorldInfos: Component<{
  worldInfos: WorldInfo[];
  correlationId: number;
}> = (props) => {
  return (
    <Show when={props.worldInfos.length > 0}>
      <Box>
        <Flex>
          <CardHeading>World Info</CardHeading>
          <Button
            colorScheme={"neutral"}
            ml={"auto"}
            type={"button"}
            onClick={() => {
              const blob = new Blob(
                [
                  JSON.stringify(
                    props.worldInfos.map((e) => ({
                      entry: e.Entry,
                      keys: e.Keys,
                      isNotHidden: true,
                      publicId: v4(),
                    }))
                  ),
                ],
                { type: "application/json" }
              );
              saveAs(blob, `${props.correlationId}-worldInfo.json`);
            }}
          >
            Download AID JSON
          </Button>
        </Flex>
        <For each={props.worldInfos}>
          {(worldInfo) => (
            <SimpleGrid
              columns={{ "@initial": 1, "@md": 2, "@2xl": 3 }}
              gap="$6"
            >
              <Card>
                <Heading level={3} size={"xl"} mb={"$2"}>
                  Keys
                </Heading>
                <code>{worldInfo.Keys}</code>
                <Divider thickness={"$0_5"} my={"$4"} />
                <Heading level={3} size={"xl"} mb={"$2"}>
                  Entry
                </Heading>
                <code>{worldInfo.Entry}</code>
              </Card>
            </SimpleGrid>
          )}
        </For>
      </Box>
    </Show>
  );
};

const SubScenarios: Component<{ children: Child[] }> = (props) => {
  return (
    <Show when={props.children.length > 0}>
      <Box>
        <CardHeading>Sub Scenarios</CardHeading>
        <Stack direction={"column"} gap={"$3"}>
          <For each={props.children}>
            {(child) => (
              <Card>
                <Flex>
                  <Anchor
                    as={Link}
                    my={"auto"}
                    width={"100%"}
                    href={`/${child.Id}`}
                  >
                    <Heading level={3} size={"lg"}>
                      {child.Title}
                    </Heading>
                  </Anchor>
                  <Anchor ml={"auto"} as={Link} href={`/${child.Id}`}>
                    <Button>View</Button>
                  </Anchor>
                </Flex>
              </Card>
            )}
          </For>
        </Stack>
      </Box>
    </Show>
  );
};

const CardHeading: ParentComponent = (props) => {
  return (
    <Heading level={2} size={"xl"} mb={"$1"}>
      {props.children}
    </Heading>
  );
};

const PromptDisplay: Component<{ prompt: Prompt }> = (props) => {
  return (
    <Stack direction={"column"} gap={"$3"}>
      <Heading level={1} size={"3xl"}>
        {props.prompt.Title}
      </Heading>
      <Show
        when={props.prompt.ParentId}
        fallback={
          <>
            <Text>
              Published on {format(props.prompt.DateCreated, "yyyy/MM/dd")}
            </Text>
            <Text>
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
                  <Badge
                    textTransform={"lowercase"}
                    colorScheme={"primary"}
                    marginLeft={"$1"}
                  >
                    {tag.trim()}
                  </Badge>
                )}
              </For>
            </Text>
          </>
        }
      >
        {(parentId) => (
          <Alert status="info">
            <AlertIcon mr="$2_5" mb="auto" />
            <Stack direction={"column"}>
              <AlertTitle>You are viewing a sub scenario</AlertTitle>
              <AlertDescription>
                <Anchor
                  as={Link}
                  my={"auto"}
                  width={"100%"}
                  href={`/${parentId}`}
                >
                  Click here to return to the parent
                </Anchor>
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Show>
      <ExportOptions prompt={props.prompt} />
      <Show when={props.prompt.Description}>
        {(description) => (
          <Box>
            <CardHeading>Description</CardHeading>
            <Card>
              <code>{description}</code>
            </Card>
          </Box>
        )}
      </Show>
      <Show when={props.prompt.PromptContent}>
        {(promptContent) => (
          <Box>
            <CardHeading>Prompt</CardHeading>
            <Card>
              <code>{promptContent}</code>
            </Card>
            <Flex>
              <Text color={"$neutral10"} ml={"auto"}>
                {promptContent.length} characters
              </Text>
            </Flex>
          </Box>
        )}
      </Show>
      <Show when={props.prompt.Memory}>
        {(memory) => (
          <Box>
            <CardHeading>Memory</CardHeading>
            <Card>
              <code>{memory}</code>
            </Card>
            <Flex>
              <Text color={"$neutral10"} ml={"auto"}>
                {memory.length} characters
              </Text>
            </Flex>
          </Box>
        )}
      </Show>
      <Show when={props.prompt.Quests}>
        {(quests) => (
          <Box>
            <CardHeading>Quests</CardHeading>
            <Card>
              <code>{quests}</code>
            </Card>
            <Flex>
              <Text color={"$neutral10"} ml={"auto"}>
                {quests.length} characters
              </Text>
            </Flex>
          </Box>
        )}
      </Show>
      <Show when={props.prompt.AuthorsNote}>
        {(authorsNote) => (
          <Box>
            <CardHeading>Authors Note</CardHeading>
            <Card>
              <code>{authorsNote}</code>
            </Card>
            <Flex>
              <Text color={"$neutral10"} ml={"auto"}>
                {authorsNote.length} characters
              </Text>
            </Flex>
          </Box>
        )}
      </Show>
      <Show when={props.prompt.ScriptZip}>
        {(scriptZip) => (
          <Box>
            <CardHeading>AID Script</CardHeading>
            <Card>
              <Text color="$danger10">
                This file has <strong>not</strong> been scanned for viruses,
                download at your own risk
              </Text>
              <Button
                type={"button"}
                mt={"$2"}
                onClick={() => {
                  const blob = new Blob([scriptZip], {
                    type: "application/zip",
                  });
                  saveAs(blob, `${props.prompt.CorrelationId}-scripts.zip`);
                }}
              >
                Download
              </Button>
            </Card>
          </Box>
        )}
      </Show>
      <WorldInfos
        worldInfos={props.prompt.WorldInfos}
        correlationId={props.prompt.CorrelationId}
      />
      <SubScenarios children={props.prompt.Children} />
    </Stack>
  );
};

export default PromptDisplay;
