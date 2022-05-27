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
  SearchOptions,
  TagSearchOptions,
  TagSearchOptionsType,
} from "Services/SqljsService";
import { useSearchParams } from "solid-app-router";
import {
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch,
  useContext,
} from "solid-js";
import BottomNav from "./BottomNav";
import HomePromptDisplay from "./HomePromptDisplay";

type SearchState =
  | { type: "Loading" }
  | { type: "Loaded"; prompts: HomePrompt[] }
  | { type: "Error"; error: string };

const Home: Component = () => {
  const sql = useContext(SqljsServiceContext);
  const [searchParams] = useSearchParams();

  const [searchState, setSearchState] = createSignal<SearchState>({
    type: "Loading",
  });
  const [titleSearch, setTitleSearch] = createSignal<string>("");
  const [nsfwSearch, setNsfwSearch] = createSignal<NsfwSearchType>(
    NsfwSearch[0]
  );
  const [tagSearch, setTagSearch] = createSignal<string>(
    searchParams.tag ?? ""
  );

  const [totalPages, setTotalPages] = createSignal<number>();

  const getPageFromParams = () => {
    const parsedInt = Number.parseInt(searchParams.page ?? "0");
    console.log(parsedInt);
    return Number.isNaN(parsedInt) ? 0 : parsedInt;
  };

  const [currentPage, setCurrentPage] = createSignal<number>(
    getPageFromParams()
  );

  const searchOptions = (): SearchOptions => ({
    title: titleSearch(),
    nsfw: nsfwSearch(),
    tags: tagSearch(),
    tagSearchOption: tagSearchOption(),
    matchTagsExactly: matchTagsExactly(),
    reverseSearch: reverseSearch(),
    page: currentPage(),
  });

  createEffect((prev) => {
    if (prev === searchParams.tag) {
      return searchParams.tag;
    }

    const tag = searchParams.tag ?? "";
    setTagSearch(tag);
    performSearch({
      ...searchOptions(),
      tags: tag,
    });
    return searchParams.tag;
  }, searchParams.tag);

  createEffect((prev) => {
    if (prev === searchParams.page) {
      return searchParams.page;
    }

    const page = getPageFromParams();
    setCurrentPage(page);
    performSearch({
      ...searchOptions(),
      page: page,
    });
    return searchParams.page;
  }, searchParams.page);

  const [tagSearchOption, setTagSearchOption] =
    createSignal<TagSearchOptionsType>(TagSearchOptions[0]);
  const [matchTagsExactly, setMatchTagsExactly] = createSignal<boolean>(true);
  const [reverseSearch, setReverseSearch] = createSignal<boolean>(false);

  const performSearch = (options: SearchOptions) => {
    if (sql.type === "Loaded") {
      setSearchState({ type: "Loading" });
      (async () => {
        try {
          const result = await sql.service.search(options);
          setSearchState({
            type: "Loaded",
            prompts: result.prompts,
          });
          setTotalPages(result.pages);
        } catch (e) {
          setSearchState({ type: "Error", error: (e as Error).toString() });
        }
      })();
    }
  };

  onMount(() => {
    performSearch(searchOptions());
  });

  const isError = () => {
    const state = searchState();
    return state.type === "Error" && state;
  };

  const isLoaded = () => {
    const state = searchState();
    return state.type === "Loaded" && state;
  };

  const isLoading = () => searchState().type === "Loading";

  return (
    <Stack direction={"column"} gap={"$3"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          performSearch({ ...searchOptions(), page: 0 });
        }}
      >
        <Flex direction={{ "@initial": "column", "@md": "row" }}>
          <SimpleGrid
            width={"100%"}
            columns={{ "@initial": 1, "@md": 2 }}
            gap="$3"
          >
            <Input
              disabled={isLoading()}
              value={titleSearch()}
              placeholder="Search Title"
              onInput={(e) => setTitleSearch(e.currentTarget.value)}
            />
            <Select
              disabled={isLoading()}
              defaultValue={nsfwSearch()}
              onChange={setNsfwSearch}
            >
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
              disabled={isLoading()}
              value={tagSearch()}
              placeholder="Tags (comma delimited)"
              onInput={(e) => setTagSearch(e.currentTarget.value)}
            />
            <Checkbox
              disabled={isLoading()}
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
              disabled={isLoading()}
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
              disabled={isLoading()}
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
            <Button type="submit" loading={isLoading()} disabled={isLoading()}>
              Search
            </Button>
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

      <Show when={totalPages()}>
        {(totalPages) => (
          <BottomNav currentPage={currentPage()} totalPages={totalPages} />
        )}
      </Show>
    </Stack>
  );
};

export default Home;
