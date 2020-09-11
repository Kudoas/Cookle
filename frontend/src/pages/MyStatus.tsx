import React, { useEffect, useState } from "react";

import MDSpinner from "react-md-spinner";
import Container from "@material-ui/core/Container";

import { asyncLocalStorage } from "../utils";
import { getMyStatus, getMyGraph } from "./../api";
import useLoginRedirect from "../hooks/useLoginRedirect";
import ErrorMessage from "./../components/ErrorMessage";
import MedalStatus from "./../components/MedalStatus";

interface State {
  level: number;
  meal_id: number;
  meal_name: string;
}

const Home: React.FC = () => {
  const [medalStatus, setMedalStatus] = useState<State[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [graphUrl, setGraphUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  useLoginRedirect();

  useEffect(() => {
    const f = async () => {
      const jwtToken = await asyncLocalStorage.getItem("access_token");
      await getMyStatus(jwtToken)
        .then((res) => {
          setIsLoading(false);
          setMedalStatus(res.results);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setIsLoading(false);
        });
      await getMyGraph(jwtToken)
        .then((res) => {
          setGraphUrl(res.graph_url);
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setIsLoading(false);
        });
    };
    f();
  }, []);

  console.log(graphUrl);

  return (
    <Container maxWidth="xs">
      <div className="back_state">
        <h3 id="h3_back" className="animate__animated animate__jello">
          My Status
        </h3>
      </div>
      <ErrorMessage message={errorMessage} />
      {medalStatus && !isLoading ? (
        <MedalStatus medalList={medalStatus} />
      ) : (
        <p style={{ textAlign: "center" }}>
          <MDSpinner size={56} />
        </p>
      )}
      <h3>ポイント実績</h3>
      <iframe src={graphUrl} title="title" width="100%" height="450"></iframe>
      <p id="point"></p>
    </Container>
  );
};

export default Home;
