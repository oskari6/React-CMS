import { useEffect, useState } from "react";
import axios from "axios";
import { Crypto } from "../Types";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import PortfolioSummary from "../components/PortfolioSummary";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Portfolio() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null); //return array of crypto or null
  const [selected, setSelected] = useState<Crypto[]>([]);

  const [data, setData] = useState<ChartData<"pie">>();

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparklines=false";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  useEffect(() => {
    console.log("SELECTED", selected);
    if (selected.length === 0) return;
    setData({
      labels: selected.map((s) => s.name),
      datasets: [
        {
          label: "# of Votes",
          data: selected.map((s) => s.owned * s.current_price),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [selected]);

  function updateOwned(crypto: Crypto, amount: number): void {
    console.log("update owned", crypto, amount);
    let temp = [...selected];
    let tempObj = temp.find((c) => c.id === crypto.id);
    if (tempObj) {
      tempObj.owned = amount;
      setSelected(temp);
    }
  }
  return (
    <div className="portfolio-container">
      <div>
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value) as Crypto;
            setSelected([...selected, c]);
          }}
          defaultValue="default"
        >
          <option value="default">Choose an option</option>
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                );
              })
            : null}
        </select>
        </div>

      {selected.map((s) => {
        return <PortfolioSummary crypto={s} updateOwned={updateOwned} />;
      })}
      {data ? (
        <div style={{ width: 350 }}>
          <Pie data={data} />
        </div>
      ) : null}
      {selected
        ? "Your portfolio is worth: $" +
          selected
            .map((s) => {
              if (isNaN(s.owned)) {
                return 0;
              }
              return s.current_price * s.owned;
            })
            .reduce((prev, current) => {
              return prev + current;
            }, 0)
            .toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) //add all together
        : null}
        </div>
  );
}