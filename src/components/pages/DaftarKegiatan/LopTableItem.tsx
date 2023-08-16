import { Lop, LopActivity } from "@api/types/lops";
import { Box, Checkbox, HoverCard, Text, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { amdaDayJs } from "src/utils";

interface LopTableItemProps {
  lop: Lop;
  selectedActivities: LopActivity[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<LopActivity[]>>;
  setRemoveLop: React.Dispatch<React.SetStateAction<Lop | null>>;
  openRemoveLop: () => void;
  hasCRUDAccess: boolean;
  isAllowEdit: boolean;
}

export default function LopTableItem({
  lop,
  selectedActivities,
  setSelectedActivities,
  setRemoveLop,
  openRemoveLop,
  hasCRUDAccess,
  isAllowEdit,
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
            isAllowedEdit={isAllowEdit}
          />
        )}
      </tr>

      {activities?.map((activity, i) => {
        if (i === 0) return null;

        return (
          <tr key={activity.id}>
            <LopTableContent
              activity={activity}
              isSelected={selectedActivities.includes(activity)}
              setSelectedActivities={setSelectedActivities}
              isAllowedEdit={isAllowEdit}
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
      <td className="text-gray-400">-</td>
      <td className="text-gray-400">-</td>
      <td className="text-gray-400">-</td>
      <td className="text-gray-400">-</td>
      <td className="text-gray-400">-</td>
      <td className="text-gray-400">-</td>
      <td className="text-gray-400">-</td>
    </>
  );
};

const LopTableContent: React.FC<{
  activity: LopActivity;
  isSelected?: boolean;
  setSelectedActivities: React.Dispatch<React.SetStateAction<LopActivity[]>>;
  isAllowedEdit: boolean;
}> = ({
  activity,
  setSelectedActivities,
  isSelected = false,
  isAllowedEdit,
}) => {
  const dayjs = amdaDayJs();
  const inputAt = dayjs(activity.inputAt).local();

  return (
    <>
      <td>
        <Checkbox
          id="activity-id"
          name="activity-id"
          value={activity.id}
          checked={isSelected}
          disabled={!isAllowedEdit}
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setSelectedActivities((prev) => [...prev, activity]);
            } else {
              setSelectedActivities((prev) =>
                prev.filter((id) => id !== activity)
              );
            }
          }}
        ></Checkbox>
      </td>
      <td>{activity.sto.name}</td>
      <td>{activity.workType}</td>
      <td>
        {activity.workDescription ? (
          <HoverCard
            closeDelay={200}
            shadow="md"
            arrowPosition="side"
            position="bottom"
            styles={{
              dropdown: { backgroundColor: "#010101", color: "#efefef" },
            }}
          >
            <HoverCard.Target>
              <Text truncate maw={240}>
                {activity.workDescription}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Box maw={300}>
                <Text>{activity.workDescription}</Text>
              </Box>
            </HoverCard.Dropdown>
          </HoverCard>
        ) : (
          <Text color="gray">Tidak ada uraian pekerjaan</Text>
        )}
      </td>
      <td>{activity.ticket.identifier}</td>
      <td>{inputAt.format("DD/MM/YYYY - HH:mm")}</td>
      <td>{activity.ticket.location}</td>
      <td>{activity.mitra.name}</td>
    </>
  );
};
