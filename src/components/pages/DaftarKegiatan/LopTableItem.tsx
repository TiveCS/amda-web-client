import { Lop, LopActivity } from "@api/types/lops";
import { Checkbox, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface LopTableItemProps {
  lop: Lop;
  selectedActivities: LopActivity[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<LopActivity[]>>;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
  openRemoveLop: () => void;
  hasCRUDAccess: boolean;
}

export default function LopTableItem({
  lop,
  selectedActivities,
  setSelectedActivities,
  setRemoveLop,
  openRemoveLop,
  hasCRUDAccess,
}: LopTableItemProps) {
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
          <LopTableEmptyContent
            lop={lop}
            setRemoveLop={setRemoveLop}
            openRemoveLop={openRemoveLop}
            hasCRUDAccess={hasCRUDAccess}
          />
        )}

        {activities && activities.length > 0 && (
          <LopTableContent
            activity={activities[0]}
            isSelected={selectedActivities.includes(activities[0])}
            setSelectedActivities={setSelectedActivities}
          />
        )}
      </tr>

      {activities &&
        activities.map((activity, i) => {
          if (i === 0) return null;

          return (
            <tr key={i}>
              <LopTableContent
                activity={activity}
                isSelected={selectedActivities.includes(activity)}
                setSelectedActivities={setSelectedActivities}
              />
            </tr>
          );
        })}
    </>
  );
}

const LopTableEmptyContent: React.FC<{
  lop: Lop;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
  openRemoveLop: () => void;
  hasCRUDAccess: boolean;
}> = ({ setRemoveLop, lop, openRemoveLop, hasCRUDAccess }) => {
  return (
    <>
      <td>
        {hasCRUDAccess && (
          <Tooltip label="Hapus Segment">
            <button
              onClick={() => {
                setRemoveLop(lop);
                openRemoveLop();
              }}
              className={`p-0 m-0 border-none bg-transparent flex items-start group ${
                hasCRUDAccess ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <IconTrash size={20} color={hasCRUDAccess ? "black" : "gray"} />
              {""}
            </button>
          </Tooltip>
        )}
      </td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </>
  );
};

const LopTableContent: React.FC<{
  activity: LopActivity;
  isSelected?: boolean;
  setSelectedActivities: React.Dispatch<React.SetStateAction<LopActivity[]>>;
}> = ({ activity, setSelectedActivities, isSelected = false }) => {
  return (
    <>
      <td>
        <Checkbox
          id="activity-id"
          name="activity-id"
          value={activity.id}
          checked={isSelected}
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setSelectedActivities((prev) => [...prev, activity]);
              return;
            } else {
              setSelectedActivities((prev) =>
                prev.filter((id) => id !== activity)
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
  );
};
