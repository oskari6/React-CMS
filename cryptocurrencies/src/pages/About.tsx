import "./About.css";

export default function About() {
  return (
    <div className="main-content">
      <h1>About 🤷‍♂️</h1>
      <div className="about-container">
        <p>
          Hello!
          <br /> <br /> This page was made to test out and play with the React
          framework.
          <br />
          There are 2 main functionalities:
          <br /> Crypto pricechecker that give you the latest value of the
          chosen Cryptocurrency.
          <br /> And the portfolio for you Crypto currency, where you can
          collect and value your holdings.
          <br /> The api calls sent to the coingecko.com site are very limited
          and doesnt allow for many requests at a time. <br />
          Enjoy!
        </p>
      </div>
    </div>
  );
}
