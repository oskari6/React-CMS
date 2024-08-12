import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate, Link } from "react-router-dom";
import NotFound from "../components/NotFound";
import DefinitionSearch from "../components/DefinitionSearch";
import useFetch from "../hooks/UseFetch";
import {useEffect} from 'react';

export default function Definition() {
  let { search } = useParams();
  const navigate = useNavigate();
  //using [{}] to access deeper in the array
  const {request, data: [{meanings: word}] = [{}], errorStatus} = useFetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + search
  );

  useEffect(() => {
  request();
  }, []);

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
      {word ? ( //grab item with index zero, if word doesnt exists return undefined, same for meanings
        <>
          <h1>Here is a definition</h1>
          {word.map((meaning) => {
            //ternary if no[] in useState()
            return (
              <p key={uuidv4()}>
                {meaning.partOfSpeech + ": "}
                {meaning.definitions[0].definition}
              </p>
            );
          })}
          <p>Search Again</p>
          <DefinitionSearch />
        </>
      ) : null}
    </>
  );
}
