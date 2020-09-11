import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "@material-ui/core/Container";
import MDSpinner from "react-md-spinner";

import { getTimeline, getMealName } from "../api";
import { asyncLocalStorage } from "../utils";
import useLoginRedirect from "../hooks/useLoginRedirect";
import PhotoDisplay from "../components/PhotoDisplay";
import ErrorMessage from "./../components/ErrorMessage";
import LogoutButton from "../components/LogoutButton";

interface Post {
  post_id: number;
  user_id: number;
  name?: string;
  image_url: string;
  create_at: string;
}

const Timeline: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [mealName, setMealName] = useState([{ meal_name: "" }]);
  const [bonus, setBonus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useLoginRedirect();
  const history = useHistory();
  useEffect(() => {
    const f = async () => {
      const jwtToken: any = await asyncLocalStorage
        .getItem("access_token")
        .catch((err) => console.log(err));
      await getTimeline(jwtToken)
        .then((res) => {
          setPosts(res.results);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
      await getMealName()
        .then((res) => {
          setMealName(res.results);
          setBonus(res.bonus);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    };
    f();
  }, []);

  const onClick = () => {
    asyncLocalStorage.removeItem("access_token");
    history.push("/");
  };

  return (
    <Container maxWidth="xs">
      <h3 id="h3_timeline" className="animate__animated animate__fadeIn">
        Timeline
      </h3>
      <ErrorMessage message={errorMessage} />
      <div className="back_bonus">
        <p>ポイント2倍！！</p>
        <p>
          <i className="fas fa-medal"></i>今日のボーナス料理：
          <a style={{ color: "#f4a460" }} href={`https://recipe.rakuten.co.jp/search/${bonus}`}>
            {bonus}
          </a>
        </p>
      </div>
      <div className="items">
        {posts ? (
          <PhotoDisplay post_id={posts} />
        ) : (
          <p style={{ textAlign: "center" }}>
            <MDSpinner size={56} />
          </p>
        )}
        <hr />
      </div>
      <p style={{ textAlign: "center" }}>
        <LogoutButton onClick={onClick} />
      </p>
    </Container>
  );
};

export default Timeline;
