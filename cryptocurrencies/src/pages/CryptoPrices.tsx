import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import CryptoSummary from "../components/CryptoSummary";
import type { Crypto } from "../Types";
import CoingeckoLimit from "../components/CoingeckoLimit";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CyptoPrices() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null); //return array of crypto or null
  const [selected, setSelected] = useState<Crypto | null>();

  const [range, setRange] = useState<string>("30");

  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        display: false, //for no multiple charts
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });
  const [requestError, setRequestError] = useState(false);

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparklines=false";
    axios
      .get(url)
      .then((response) => {
        setCryptos(response.data);
      })
      .catch((error) => {
        setRequestError(true);
        console.log("error caught: ", error);
      });
  }, [setRequestError]);

  useEffect(() => {
    if (!selected) return;
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${
          selected.id
        }/market_chart?vs_currency=usd&days=${range}&${
          range === "1" ? "interval=hourly" : "interval=daily"
        }`
      )
      .then((response) => {
        console.log(response.data);
        setData({
          labels: response.data.prices.map((price: number[]) => {
            return moment
              .unix(price[0] / 1000)
              .format(range === "1" ? "HH-MM" : "MM-DD");
          }),
          datasets: [
            {
              label: "Dataset 1",
              data: response.data.prices.map((price: number[]) => {
                return price[1];
              }),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        setOptions({
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text:
                `${selected.name} Price over last ` +
                range +
                (range === "1" ? " Day" : " day(s)"),
            },
          },
        });
      })
      .catch((error) => {
        setRequestError(true);
        console.log("Error caught: ", error);
      });
  }, [selected, range]);

  if (requestError) {
    return <CoingeckoLimit />;
  }

  return (
    <div className="main-content">
      <h1>Cryptoprices 💸</h1>
      <div className="chart-container">
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value);
            setSelected(c);
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
        <select
          onChange={(e) => {
            setRange(e.target.value);
          }}
        >
          <option value="30">30 Days</option>
          <option value="7">7 Days</option>
          <option value="1">1 Day</option>
        </select>

        {selected ? <CryptoSummary crypto={selected} /> : null}
        {data ? (
          <div style={{ width: 600 }}>
            <Line options={options} data={data} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
