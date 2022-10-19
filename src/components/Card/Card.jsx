import { useState } from "react";
import Skeleton from "react-loading-skeleton";

export const Card = ({
  deleteCard,
  editCardStatus,
  data: { _id, title, createdAt, user, description, status, importance },
  data,
}) => {
  const { userName } = user || { userName: "" };
  const [showMore, setShowMore] = useState(false);

  const datetime = createdAt && new Date(createdAt).toLocaleString() + " hs.";

  const limitString = (str) => {
    if (str?.length > 170)
      return { string: str.slice(0, 167).concat("..."), addButton: true };
    return { string: str, addButton: false };
  };

  return (
    <div className="card">
      {_id && (
        <div className="close" onClick={() => deleteCard(_id)}>
          x
        </div>
      )}
      <h3>{title || <Skeleton />}</h3>
      <h6>{datetime || <Skeleton />}</h6>
      <h5>{userName || <Skeleton />}</h5>
      {_id ? (
        <>
          <button
            className={status.toLowerCase()}
            type="button"
            onClick={() => editCardStatus(data)}
          >
            {status.toLowerCase()}
          </button>
          <button className={importance.toLowerCase()} type="button">
            {importance.toLowerCase()}
          </button>
        </>
      ) : (
        <Skeleton />
      )}
      {!showMore && (
        <p>
          {(description && limitString(description).string) || <Skeleton />}
        </p>
      )}
      {showMore && (
        <>
          <p>{description || <Skeleton />}</p>
          <button type="button" onClick={() => setShowMore(false)}>
            Ver menos
          </button>
        </>
      )}
      {!showMore && limitString(description).addButton && (
        <button type="button" onClick={() => setShowMore(true)}>
          Ver más
        </button>
      )}
    </div>
  );
};
