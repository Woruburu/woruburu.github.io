import {
  Button,
  Checkbox,
  Flex,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectTrigger,
  SelectValue,
  SimpleGrid,
  Stack,
} from "@hope-ui/solid";
import ErrorAlert from "Components/ErrorAlert";
import LoadingSpinner from "Components/LoadingSpinner";
import SqljsServiceContext from "Contexts/SqljsServiceContext";
import {
  HomePrompt,
  NsfwSearch,
  NsfwSearchType,
  TagSearchOptions,
  TagSearchOptionsType,
} from "Services/SqljsService";
import {
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  Switch,
  useContext,
} from "solid-js";
import HomePromptDisplay from "./HomePromptDisplay";

type SearchState =
  | { type: "Loading" }
  | { type: "Loaded"; prompts: HomePrompt[] }
  | { type: "Error"; error: string };

const Home: Component = () => {
  const sql = useContext(SqljsServiceContext);

  const [searchState, setSearchState] = createSignal<SearchState>({
    type: "Loading",
  });
  const [titleSearch, setTitleSearch] = createSignal<string>("");
  const [nsfwSearch, setNsfwSearch] = createSignal<NsfwSearchType>(
    NsfwSearch[0]
  );
  const [tagSearch, setTagSearch] = createSignal<string>("");
  const [tagSearchOption, setTagSearchOption] =
    createSignal<TagSearchOptionsType>(TagSearchOptions[0]);
  const [matchTagsExactly, setMatchTagsExactly] = createSignal<boolean>(true);
  const [reverseSearch, setReverseSearch] = createSignal<boolean>(false);

  const performSearch = async () => {
    if (sql.type === "Loaded") {
      setSearchState({ type: "Loading" });
      (async () => {
        try {
          setSearchState({
            type: "Loaded",
            prompts: await sql.service.search({
              title: titleSearch(),
              nsfw: nsfwSearch(),
              tags: tagSearch(),
              tagSearchOption: tagSearchOption(),
              matchTagsExactly: matchTagsExactly(),
              reverseSearch: reverseSearch(),
            }),
          });
        } catch (e) {
          setSearchState({ type: "Error", error: (e as Error).toString() });
        }
      })();
    }
  };

  createEffect(() => {
    performSearch();
  });

  const isError = () => {
    const state = searchState();
    return state.type === "Error" && state;
  };

  const isLoaded = () => {
    const state = searchState();
    return state.type === "Loaded" && state;
  };

  return (
    <Stack direction={"column"} gap={"$3"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          performSearch();
        }}
      >
        <Flex direction={{ "@initial": "column", "@md": "row" }}>
          <SimpleGrid
            width={"100%"}
            columns={{ "@initial": 1, "@md": 2 }}
            gap="$3"
          >
            <Input
              value={titleSearch()}
              placeholder="Search Title"
              onChange={(e) => setTitleSearch(e.currentTarget.value)}
            />
            <Select defaultValue={nsfwSearch()} onChange={setNsfwSearch}>
              <SelectTrigger>
                <SelectValue />
                <SelectIcon />
              </SelectTrigger>
              <SelectContent>
                <SelectListbox>
                  <For each={NsfwSearch}>
                    {(item) => (
                      <SelectOption value={item}>
                        <SelectOptionText>{item}</SelectOptionText>
                        <SelectOptionIndicator />
                      </SelectOption>
                    )}
                  </For>
                </SelectListbox>
              </SelectContent>
            </Select>
            <Input
              value={tagSearch()}
              placeholder="Tags (comma delimited)"
              onChange={(e) => setTagSearch(e.currentTarget.value)}
            />
            <Checkbox
              checked={matchTagsExactly()}
              onChange={(
                e: Event & {
                  currentTarget: HTMLInputElement;
                  target: Element;
                }
              ) => setMatchTagsExactly(e.currentTarget.checked)}
            >
              Match Tags Exactly
            </Checkbox>
            <Select
              defaultValue={tagSearchOption()}
              onChange={setTagSearchOption}
            >
              <SelectTrigger>
                <SelectValue />
                <SelectIcon />
              </SelectTrigger>
              <SelectContent>
                <SelectListbox>
                  <For each={TagSearchOptions}>
                    {(item) => (
                      <SelectOption value={item}>
                        <SelectOptionText>{item}</SelectOptionText>
                        <SelectOptionIndicator />
                      </SelectOption>
                    )}
                  </For>
                </SelectListbox>
              </SelectContent>
            </Select>
            <Checkbox
              checked={reverseSearch()}
              onChange={(
                e: Event & {
                  currentTarget: HTMLInputElement;
                  target: Element;
                }
              ) => setReverseSearch(e.currentTarget.checked)}
            >
              Reverse Search
            </Checkbox>
          </SimpleGrid>
          <Flex
            mt={{ "@initial": "$3", "@md": "initial" }}
            ml={{ "@md": "auto" }}
            pl={{ "@md": "$3" }}
            direction={{ "@initial": "row-reverse", "@md": "column" }}
          >
            <Button type="submit">Search</Button>
            <Button
              type="button"
              mr={{ "@initial": "auto", "@md": "initial" }}
              mt={"auto"}
              size={"sm"}
              colorScheme={"neutral"}
              variant={"outline"}
            >
              Random
            </Button>
          </Flex>
        </Flex>
      </form>
      <Switch>
        <Match when={searchState().type === "Loading"}>
          <LoadingSpinner />
        </Match>
        <Match when={isError()}>
          {(error) => (
            <ErrorAlert title="Failed to search" description={error.error} />
          )}
        </Match>
        <Match when={isLoaded()}>
          {(loaded) => (
            <SimpleGrid
              columns={{ "@initial": 1, "@md": 2, "@2xl": 3 }}
              gap="$6"
            >
              <For fallback={"No results"} each={loaded.prompts}>
                {(prompt) => <HomePromptDisplay prompt={prompt} />}
              </For>
            </SimpleGrid>
          )}
        </Match>
      </Switch>
    </Stack>
  );
};

export default Home;
