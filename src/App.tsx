import { useState } from "react";
import s from "./App.module.css";
import { useDebounce } from "./hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import itemsService from "./services/items";

function App() {
  const items = useQuery({
    queryKey: ["items"],
    queryFn: itemsService.getAll,
  });
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const search = useDebounce(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div>
      <div className={s.inputContainer}>
        <div className={s.inputWrapper}>
          <input
            type="text"
            className={s.input}
            value={value}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          />
          <ul
            className={`${s.suggestions} ${
              showSuggestions ? s.suggestionsVisible : ""
            }`}
          >
            <li className={s.suggestion}>
              <button className={s.suggestionBtn}>
                <span>item 1</span>
                <span className={s.category}>category 1</span>
              </button>
            </li>
            <li className={s.suggestion}>
              <button className={s.suggestionBtn}>
                <span>item 2</span>
                <span className={s.category}>category 2</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
