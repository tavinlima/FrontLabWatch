import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { reduceEachLeadingCommentRange } from "typescript";
//import { v4 as uuidv4 } from 'uuid4';
import uuid from "uuid";
//const { v4: uuidv4 } = require('uuid');
import Header from "../../Components/header";
import SideBar from "../../Components/sidebar";
import api from "../../services/api";

function App() {
  const [listaTasks, setListaTasks] = useState([]);

  const listarTodasTasks = () => {
    api('/Tasks', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
      }
    }).then(resposta => {
      if (resposta.status === 200) {
        console.log(resposta.data)
        setListaTasks(resposta.data)
      }
    })
  }

  useEffect(listarTodasTasks, [])

  // const initial = Array.from({ length: 1000 }, (_, k) => ({
  //   id: `id:${k}`,
  //   text: `item ${k}`,
  // }))

  // const itemsFromBackend = Array.from([listaTasks], (x) => ({
  //   id: `id:${eval(x.idTask)}`,
  //   content: `content ${eval(x.descricao)}`,
  // }))

  const itemsFromBackend = [
    { id: uuid(), content: "Fazer Api" },
  ];

  const columnsFromBackend = {
    [uuid()]: {
      name: "Backlog",
      items: [],
    },
    [uuid()]: {
      name: "To do",
      items: itemsFromBackend
    },
    [uuid()]: {
      name: "In Progress",
      items: []
    },
    [uuid()]: {
      name: "Done",
      items: []
    }
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };


  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div>
      <Header />
      <SideBar />
      <h1 style={{ height: "100%", marginLeft: 300, position: 'absolute', marginTop: 110 }}>Projeto LabWatch</h1>
      <div style={{ display: "flex", justifyContent: "flex-end", height: "100%", marginLeft: 300, position: 'absolute', marginTop: 140 }}>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                }}
                key={columnId}
              >

                <div style={{
                  backgroundColor: '#1B65A6',
                  position: 'relative',
                  width: 250,
                  borderRadius: 10,
                  color: 'white',
                  fontWeight: 'normal',
                  marginTop: 40,
                  height: 50,
                }}>
                  <h2 style={{ paddingLeft: 18 }}>{column.name}</h2>
                </div>

                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "#CDCACA",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                            borderRadius: 10
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      //style dos cards
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        width: 150,
                                        borderRadius: 15,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        margin: "0 0 10px 0",
                                        minHeight: "50px",
                                        fontWeight: 'bold',
                                        marginLeft: 35,
                                        backgroundColor: snapshot.isDragging
                                          ? "#F8ECEC"
                                          : "white",
                                        color: "#1D2D3A",

                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
