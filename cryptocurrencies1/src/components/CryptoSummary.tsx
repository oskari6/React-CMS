import { Crypto } from "../Types";

export type AppProps = {
  crypto: Crypto;
};

export default function CryptoSummary({ crypto }: AppProps): JSX.Element {
  //returning jsx element
  return <p>{crypto.name + " $" + crypto.current_price}</p>;
}
