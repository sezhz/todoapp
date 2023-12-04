import React, { useState, useEffect } from "react";
import "./styles.css";
import tw from "twin.macro";
import styled from "@emotion/styled";

const RedButton = styled.button`
  ${tw`bg-red-500 text-white px-2 py-1 mx-1 my-2 rounded-md`}
`;
const GreenButton = styled.button`
  ${tw`bg-green-500 text-white px-2 py-1 mx-1 my-2 rounded-md`}
`;
const BlueButton = styled.button`
  ${tw`bg-blue-400 text-white px-2 py-1 border border-gray-300 p-1`}
`;

const Checkbox = styled.input`
  ${tw`mr-2`}
`;

interface TodoItemProps {
  isChecked: boolean;
}

const TodoItem = styled.li<TodoItemProps>`
  ${tw`flex justify-between items-center`}

  > div {
    ${tw`flex items-center`}
    > span {
      ${({ isChecked }) => isChecked && tw`line-through text-gray-500`}
    }
  }

  &:nth-child(odd) {
    ${tw`bg-gray-200 pr-2 pl-2`}
  }

  &:nth-child(even) {
    ${tw`pr-2 pl-2`}
  }
`;

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [actions, setActions] = useState<string[]>(
    JSON.parse(localStorage.getItem("todos") || "[]")
  );
  const [editAction, setEditAction] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    JSON.parse(localStorage.getItem("checkedItems") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(actions));
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [actions, checkedItems]);

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setActions((prevTodos) => [...prevTodos, newTodo.trim()]);
      setCheckedItems((prevChecked) => [...prevChecked, false]);
      setNewTodo("");
    }
  };

  const handleEdit = (index: number) => {
    setEditAction(index);
    setEditValue(actions[index]);
  };

  const handleSaveEdit = (index: number) => {
    const updatedTodos = [...actions];
    updatedTodos[index] = editValue.trim();
    setActions(updatedTodos);
    setEditAction(null);
  };

  const handleDelete = (index: number) => {
    const updatedTodos = actions.filter((_, i) => i !== index);
    setActions(updatedTodos);
    setCheckedItems((prevChecked) => prevChecked.filter((_, i) => i !== index));
  };

  return (
    <div
      className="App"
      style={{ border: "2px solid rgba(0, 0, 0, 0.320)", padding: "10px" }}
    >
      <header className="App-header">
        <h1 className="font-bold text-2xl mb-4 p-2 bg-gray-100">Todos</h1>
        <div className="flex items-center justify-between pb-3">
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border border-gray-300 p-1 flex-grow"
          />
          <BlueButton onClick={handleAddTodo} className="blue-button">
            Submit
          </BlueButton>
        </div>
        <ul>
          {actions.map((todo, index) => (
            <TodoItem key={index} isChecked={checkedItems[index]}>
              <Checkbox
                type="checkbox"
                className="mr-2"
                checked={checkedItems[index]}
                onChange={(e) => {
                  const newCheckedItems = [...checkedItems];
                  newCheckedItems[index] = e.target.checked;
                  setCheckedItems(newCheckedItems);
                }}
              />
              {editAction === index ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex items-center">
                    <GreenButton onClick={() => handleSaveEdit(index)}>
                      Save
                    </GreenButton>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span>{todo}</span>
                  </div>
                  <div className="flex items-center">
                    <GreenButton onClick={() => handleEdit(index)}>
                      Edit
                    </GreenButton>
                    <RedButton onClick={() => handleDelete(index)}>
                      Delete
                    </RedButton>
                  </div>
                </>
              )}
            </TodoItem>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
//