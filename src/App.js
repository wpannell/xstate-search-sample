import React from "react";
import "./styles.css";
import { useMachine } from "@xstate/react";
import { searchMachine } from "./searchMachine";

//------------------------------------------Results
const Results = ({ comments }) => {
  //   expect to be rerendered onSubmit but it does not
  console.log("Results", comments);
  return <div> Results {comments.length} </div>;
};
//------------------------------------------SearchBar
const SearchBar = () => {
  const [state, send] = useMachine(searchMachine);
  console.log("SearchBar", state.context);

  const handleSubmit = (e) => {
    e.preventDefault();
    return send("SUBMIT");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="searchInput"
        type="search"
        placeholder="e.g 1,2,3..."
        value={state.context.query}
        onChange={(e) => send("INPUT", { value: e.target.value })}
        onFocus={() => send("TYPING_START")}
      />
    </form>
  );
};

//------------------------------------------Container
export default function App() {
  const [state] = useMachine(searchMachine);
  return (
    <div className="App">
      <h2>insert a post number e.g 1,2,3..</h2>
      <SearchBar />
      <Results comments={state.context.data || []} />
    </div>
  );
}
