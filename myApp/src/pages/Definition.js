import { v4 as uuidv4 } from "uuid";
import { useParams, Link } from "react-router-dom";
import NotFound from "../components/NotFound";
import DefinitionSearch from "../components/DefinitionSearch";
import { useEffect, useState } from "react";

export default function Definition() {
  let { search } = useParams();
  const [word, setWord] = useState([]);
  const [errorStatus, setErrorStatus] = useState(false);

  const request = async () => {
    try {
      const response = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + search,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );
      if (!response.ok) {
        setErrorStatus(true);
        return;
      }
      const result = await response.json();

      setWord(result);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setErrorStatus(true);
    }
  };

  useEffect(() => {
    request();
  }, [search]);

  if (errorStatus === 404) {
    return (
      <>
        <NotFound />
        <Link to="/dictionary">Search Again</Link>
      </>
    );
  }
  if (errorStatus) {
    return (
      <>
        <p>Something went wrong, try again?</p>
        <Link to="/dictionary">Search Again</Link>
      </>
    );
  }

  return (
    <>
      <h1>Here is a definition</h1>
      {word.map((entry) =>
        entry.meanings.map((meaning) =>
          meaning.definitions.map((definition) => (
            <p key={uuidv4()}>
              {meaning.partOfSpeech}: {definition.definition}
            </p>
          ))
        )
      )}
    </>
  );
}
