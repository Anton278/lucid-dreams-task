import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import itemsService from "./services/items";
import { Item } from "./models/item";

import s from "./App.module.css";

function App() {
  const items = useQuery({
    queryKey: ["items"],
    queryFn: itemsService.getAll,
  });

  const [formula, setFormula] = useState<any[]>([
    { type: "operator", value: "", width: "100%", id: uuidv4() },
  ]);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const lastInputRef = useRef<HTMLInputElement>(null);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement>,
    item: { [key: string]: any },
    isLastChild: boolean
  ) {
    setFormula((oldFormula) =>
      oldFormula.map((oldItem) =>
        oldItem.id === item.id
          ? {
              ...oldItem,
              value: e.target.value,
              width: isLastChild
                ? "100%"
                : e.target.value.length
                ? e.target.value.length + "ch"
                : "1ch",
            }
          : oldItem
      )
    );

    const q = e.target.value.replaceAll(/\W/g, "");
    if (!q.length) {
      return setShowSuggestions(false);
    }
    if (!items.data) {
      // check again in which case data is undefined
      return;
    }
    const suggestions = items.data
      .filter((item) => item.name.includes(q))
      .slice(0, 10);
    setSuggestions(suggestions);
    setShowSuggestions(true);
  }

  function onKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    isFirstInput: boolean
  ) {
    if (e.ctrlKey && e.code === "KeyA") {
      // select all here...
    }
    if (e.currentTarget.selectionStart === 0 && e.code === "Backspace") {
      if (isFirstInput) {
        return;
      }
      setFormula((oldFormula) => {
        let newFormula = oldFormula.slice(0, -2);
        newFormula[newFormula.length - 1].autoFocus = true;
        newFormula[newFormula.length - 1].width = "100%";

        return newFormula;
      });
    }
  }

  function onSuggestionClick(suggestion: Item) {
    setFormula((oldFormula) => {
      const lastItem = oldFormula[oldFormula.length - 1];
      lastItem.value = lastItem.value.replaceAll(/\w/g, "");
      lastItem.width = lastItem.value.length + "ch";
      return [
        ...oldFormula,
        { type: "operand", ...suggestion },
        {
          type: "operator",
          value: "",
          id: uuidv4(),
          width: "100%",
          autoFocus: true,
        },
      ];
    });
    setShowSuggestions(false);
    setSuggestions([]);
  }

  useEffect(() => {
    // focus last input after deleted last tag
    const lastFormulaItem = formula[formula.length - 1];
    if (!lastFormulaItem?.autoFocus) {
      return;
    }
    if (!lastInputRef.current) {
      return;
    }
    lastInputRef.current.focus();
  }, [formula]);

  return (
    <div className={s.container}>
      <div className={s.inputWrapper}>
        <div className={s.inputContainer}>
          {formula.map((item, i) =>
            item.type === "operator" ? (
              <input
                type="text"
                className={s.input}
                value={item.value}
                key={item.id}
                style={{ width: item.width }}
                onChange={(e) => onChange(e, item, i === formula.length - 1)}
                onKeyDown={(e) => onKeyDown(e, i === 0)}
                ref={i === formula.length - 1 ? lastInputRef : undefined}
              />
            ) : (
              <div className={s.tag} key={item.id}>
                {item.name}
              </div>
            )
          )}
        </div>
        <ul
          className={`${s.suggestions} ${
            showSuggestions ? s.suggestionsVisible : ""
          }`}
        >
          {suggestions.map((suggestion) => (
            <li
              className={s.suggestion}
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion)}
            >
              <button className={s.suggestionBtn}>
                <span>{suggestion.name}</span>
                <span className={s.category}>{suggestion.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
