import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import "react-loading-skeleton/dist/skeleton.css";

import "./Tasks.styles.css";
import { getTasks } from "../../../store/slices/tasksSlice";
import { useResize } from "../../../hooks/useResize";
import { Header } from "../../Header/Header";
import { TaskForm } from "../../TaskForm/TaskForm";
import { Card } from "../../Card/Card";

import _ from "lodash";

export const Tasks = () => {
  const { isPhone } = useResize();
  const [filters, setFilters] = useState({ tasksfromWho: "ALL", search: "" });
  const [renderList, setRenderList] = useState(null);

  const dispatch = useDispatch();

  const { tasks, error, loading } = useSelector((state) => state.tasks);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getTasks(filters.tasksfromWho === "ME" ? "me" : ""));
  }, [filters.tasksfromWho, dispatch]);

  useEffect(() => {
    if (loading) {
      setRenderList([
        { status: "NEW" },
        { status: "IN PROGRESS" },
        { status: "FINISHED" },
      ]);
    } else {
      setRenderList(tasks);
    }
  }, [loading, tasks]);

  useEffect(() => {
    if (filters.search)
      setRenderList(
        tasks.filter((data) => data.title.startsWith(filters.search))
      );
    else setRenderList(tasks);
  }, [filters.search, tasks]);

  const handleChangeImportance = (event) => {
    if (event.currentTarget.value === "ALL") setRenderList(tasks);
    else
      setRenderList(
        tasks.filter((data) => data.importance === event.currentTarget.value)
      );
  };

  const handleSearch = _.debounce((event) => {
    handleFilterChange(event);
  }, 1000);

  const renderAllCards = () => {
    return renderList?.map((data, i) => (
      <Card
        key={data._id || `all-${i}`}
        data={data}
        deleteCard={handleDelete}
        editCardStatus={handleEditCardStatus}
      />
    ));
  };

  const renderColumnCards = (text) => {
    return renderList
      ?.filter((data) => data.status === text)
      .map((data, i) => (
        <Card
          key={data._id || `${text}-${i}`}
          data={data}
          deleteCard={handleDelete}
          editCardStatus={handleEditCardStatus}
        />
      ));
  };

  if (error) return <div>Hay un error</div>;

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleEditCardStatus = (data) => {
    dispatch(editTaskStatus(data));
  };

  if (error) return <div>Hay un error</div>;

  return (
    <>
      <Header />
      <main id="tasks">
        <TaskForm />
        <div className="wrapper_list">
          <div className="list_header">
            <h2>Mis Tareas</h2>
          </div>
          <div className="filters">
            <FormControl>
              <RadioGroup
                row
                name="tasksfromWho"
                aria-labelledby="demo-row-radio-buttons-group-label"
                onChange={handleFilterChange}
              >
                <FormControlLabel
                  value="ALL"
                  control={<Radio />}
                  label="Todas"
                />
                <FormControlLabel
                  value="ME"
                  control={<Radio />}
                  label="Mis tareas"
                />
              </RadioGroup>
            </FormControl>
            <div className="search">
              <input
                type="text"
                placeholder="Buscar por título..."
                name="search"
                onChange={handleSearch}
              />
            </div>
            <select name="importance" onChange={handleChangeImportance}>
              <option value="">Seleccionar una prioridad</option>
              <option value="ALL">Todas</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          {isPhone ? (
            !renderList?.length ? (
              <div>No hay tareas creadas</div>
            ) : (
              <div className="list phone">{renderAllCards()}</div>
            )
          ) : (
            <div className="list_group">
              {!renderList?.length ? (
                <div>No hay tareas creadas</div>
              ) : (
                <>
                  <div className="list">
                    <h3>Nuevas</h3>
                    {renderColumnCards("NEW")}
                  </div>
                  <div className="list">
                    <h3>En progreso</h3>
                    {renderColumnCards("IN PROGRESS")}
                  </div>
                  <div className="list">
                    <h3>Finalizadas</h3>
                    {renderColumnCards("FINISHED")}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};
