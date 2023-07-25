import { Lop, LopActivity } from "@api/types/lops";
import { Checkbox } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export default function LopTableItem({
  lop,
  setListRemoveActivity,
  setRemoveLop,
  openRemoveLop,
}: {
  lop: Lop;
  setListRemoveActivity: React.Dispatch<React.SetStateAction<number[]>>;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
  openRemoveLop: () => void;
}) {
  const { activities } = lop;

  return (
    <>
      <tr>
        <td
          rowSpan={Math.max(activities ? activities.length : 0, 1)}
          className="w-48"
        >
          {lop.name}
        </td>
        {activities && activities.length === 0 && (
          <LopTableFirstContent
            lop={lop}
            setListRemoveActivity={setListRemoveActivity}
            setRemoveLop={setRemoveLop}
            openRemoveLop={openRemoveLop}
          />
        )}

        {activities && activities.length > 0 && (
          <LopTableFirstContent
            lop={lop}
            activity={activities[0]}
            setListRemoveActivity={setListRemoveActivity}
            setRemoveLop={setRemoveLop}
            openRemoveLop={openRemoveLop}
          />
        )}
      </tr>

      {activities &&
        activities.map((activity, i) => {
          if (i === 0) return null;

          return (
            <LopTableContent
              activity={activity}
              key={i}
              setListRemoveActivity={setListRemoveActivity}
            />
          );
        })}
    </>
  );
}

const LopTableFirstContent: React.FC<{
  lop: Lop;
  activity?: LopActivity;
  setListRemoveActivity: React.Dispatch<React.SetStateAction<number[]>>;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
  openRemoveLop: () => void;
}> = ({
  activity,
  setListRemoveActivity,
  setRemoveLop,
  lop,
  openRemoveLop,
}) => {
  return (
    <>
      {activity ? (
        <>
          <td>
            <Checkbox
              id="activity-id"
              name="activity-id"
              value={activity.id}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  setListRemoveActivity((prev) => [...prev, activity.id]);
                  return;
                } else {
                  setListRemoveActivity((prev) =>
                    prev.filter((id) => id !== activity.id)
                  );
                  return;
                }
              }}
            ></Checkbox>
          </td>
          <td>{activity.sto.name}</td>
          <td>{activity.workType}</td>
          <td>{activity.ticket.identifier}</td>
          <td>{activity.ticket.location}</td>
          <td>{activity.mitra.name}</td>
        </>
      ) : (
        <>
          <td>
            <button
              onClick={() => {
                setRemoveLop(lop);
                openRemoveLop();
              }}
              className="p-0 m-0 border-none bg-transparent flex items-start cursor-pointer group"
            >
              <IconTrash size={20} />
            </button>
          </td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </>
      )}
    </>
  );
};

const LopTableContent: React.FC<{
  activity: LopActivity;
  setListRemoveActivity: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ activity, setListRemoveActivity }) => {
  return (
    <tr>
      <td>
        <Checkbox
          id="activity-id"
          name="activity-id"
          value={activity.id}
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setListRemoveActivity((prev) => [...prev, activity.id]);
              return;
            } else {
              setListRemoveActivity((prev) =>
                prev.filter((id) => id !== activity.id)
              );
              return;
            }
          }}
        ></Checkbox>
      </td>
      <td>{activity.sto.name}</td>
      <td>{activity.workType}</td>
      <td>{activity.ticket.identifier}</td>
      <td>{activity.ticket.location}</td>
      <td>{activity.mitra.name}</td>
    </tr>
  );
};
