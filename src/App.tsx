import { useState, useEffect, useRef } from "react";
import s from "./App.module.css";
import { useDebounce } from "./hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import itemsService from "./services/items";

function App() {
  // const items = useQuery({
  //   queryKey: ["items"],
  //   queryFn: itemsService.getAll,
  // });
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const search = useDebounce(value);
  const [formula, setFormula] = useState<any[]>([
    { type: "operator", value: "1", id: "1", width: "1ch" },
    { type: "operand", name: "item1", id: "2" },
    { type: "operator", value: " + ", id: "3", width: "3ch" },
    { type: "operand", name: "item 2", id: "4" },
    { type: "operator", value: "", id: "5", width: "100%" },
  ]);
  const [selectedRange, setSelectedRange] = useState([0, 0]);
  const lastInputRef = useRef<HTMLInputElement>(null);

  console.log("formula ", formula);

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
  }

  function onKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    isFirstInput: boolean
  ) {
    console.log(e);
    if (e.ctrlKey && e.code === "KeyA") {
      // select all here...
    }
    if (e.currentTarget.selectionStart === 0 && e.code === "Backspace") {
      if (!e.currentTarget.value.trim() && isFirstInput) {
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

  useEffect(() => {
    const lastFormulaItem = formula[formula.length - 1];
    if (lastFormulaItem.autoFocus) {
      lastInputRef.current?.focus();
    }
  }, [formula]);

  return (
    <div>
      <div className={s.container}>
        {/* <div className={s.inputWrapper}>
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
        </div> */}
        <div className={s.inputContainer}>
          {/* {formula.map((item, i) => {
            if (item.type === "operand" && i === 0) {
              return (
                <>
                  <input type="text" className={s.input} />
                  <div className={s.tag}>{item.name}</div>
                </>
              );
            }
            if (item.type === "operand" && i === formula.length - 1) {
              return (
                <>
                  <div className={s.tag}>{item.name}</div>
                  <input type="text" className={s.input} />
                </>
              );
            }
            if (item.type === "operand") {
              return <div className={s.tag}>{item.name}</div>;
            }
            if (item.type === "operator") {
              return (
                <input
                  type="text"
                  className={s.input}
                  defaultValue={item.char}
                />
              );
            }
          })} */}
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
      </div>
    </div>
  );
}

export default App;
